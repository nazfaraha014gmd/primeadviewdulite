import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { package_id } = await req.json()

    // Create a Supabase client with the user's authorization
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the currently authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Fetch package details and user profile in parallel
    const [packageResult, profileResult] = await Promise.all([
      supabaseClient.from('packages').select('price, duration_days').eq('id', package_id).single(),
      supabaseClient.from('profiles').select('deposit_balance').eq('id', user.id).single()
    ])
    
    const { data: packageData, error: packageError } = packageResult;
    const { data: profileData, error: profileError } = profileResult;

    if (packageError || profileError) {
      throw new Error('Failed to fetch package or profile data.')
    }
    if (!packageData || !profileData) {
      throw new Error('Package or profile not found.')
    }

    // Check for sufficient balance
    if (profileData.deposit_balance < packageData.price) {
      return new Response(JSON.stringify({ error: 'Insufficient deposit balance.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const newBalance = profileData.deposit_balance - packageData.price;
    const activationDate = new Date();
    const expiryDate = new Date(activationDate);
    expiryDate.setDate(expiryDate.getDate() + packageData.duration_days);

    // Update profile, create user_package record, and log transaction
    const [updateProfileResult, insertUserPackageResult, insertTransactionResult] = await Promise.all([
        supabaseClient.from('profiles').update({ deposit_balance: newBalance }).eq('id', user.id),
        supabaseClient.from('user_packages').insert({
            user_id: user.id,
            package_id: package_id,
            activated_at: activationDate.toISOString(),
            expires_at: expiryDate.toISOString(),
        }),
        supabaseClient.from('transactions').insert({
            user_id: user.id,
            type: 'withdrawal', // Internal transfer is a form of withdrawal from deposit balance
            amount: packageData.price,
            status: 'completed',
            method: 'card', // Placeholder, as this is an internal transaction
        })
    ]);

    if (updateProfileResult.error || insertUserPackageResult.error || insertTransactionResult.error) {
        // This is a simplified error handling. In a real-world scenario, you'd want a proper transaction rollback.
        throw new Error('Failed to complete package activation transaction.');
    }

    return new Response(JSON.stringify({ message: 'Package activated successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

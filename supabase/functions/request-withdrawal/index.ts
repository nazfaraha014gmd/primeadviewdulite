import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, method } = await req.json()
    if (!amount || amount <= 0 || !method) {
      throw new Error("A valid amount and withdrawal method are required.");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    
    // Call the transactional database function
    const { error: rpcError } = await supabaseClient.rpc('request_withdrawal_and_update_earnings', {
      p_user_id: user.id,
      p_amount: amount,
      p_method: method,
    });

    if (rpcError) {
      // The DB function raises an exception for insufficient funds, which gets caught here.
      if (rpcError.message.includes('Insufficient earnings')) {
         return new Response(JSON.stringify({ error: 'Insufficient earnings for withdrawal.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      throw new Error(`Withdrawal request failed: ${rpcError.message}`);
    }

    return new Response(JSON.stringify({ message: 'Withdrawal request submitted successfully!' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

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
      throw new Error("A valid amount and payment method are required.");
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

    // Since this is a simulation, we directly add to the balance and log the transaction.
    // In a real app, this would be triggered by a payment provider's webhook.

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('deposit_balance')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const newBalance = profile.deposit_balance + amount;

    const [updateResult, insertResult] = await Promise.all([
      supabaseClient.from('profiles').update({ deposit_balance: newBalance }).eq('id', user.id),
      supabaseClient.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        status: 'completed',
        method: method,
      })
    ]);

    if (updateResult.error || insertResult.error) {
      throw new Error('Failed to process deposit.');
    }

    return new Response(JSON.stringify({ message: 'Deposit successful!' }), {
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

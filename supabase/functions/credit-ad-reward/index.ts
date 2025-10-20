import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to get the start of the current UTC day
const getStartOfUTCDay = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ad_id } = await req.json()
    if (!ad_id) {
      throw new Error("Ad ID is required.");
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

    // 1. Fetch user's active package
    const now = new Date().toISOString();
    const { data: activePackage, error: packageError } = await supabaseClient
      .from('user_packages')
      .select('*, packages(daily_ads_limit)')
      .eq('user_id', user.id)
      .lte('activated_at', now)
      .gte('expires_at', now)
      .single();

    if (packageError || !activePackage) {
      return new Response(JSON.stringify({ error: 'No active package found.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Check daily ad limit
    const startOfToday = getStartOfUTCDay().toISOString();
    const { count: adsViewedToday, error: countError } = await supabaseClient
      .from('ad_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('viewed_at', startOfToday);

    if (countError) throw countError;
    
    const dailyLimit = activePackage.packages?.daily_ads_limit ?? 0;
    if (adsViewedToday >= dailyLimit) {
      return new Response(JSON.stringify({ error: 'Daily ad limit reached.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // 3. Get ad reward amount
    const { data: adData, error: adError } = await supabaseClient
      .from('ads')
      .select('reward_amount')
      .eq('id', ad_id)
      .single();

    if (adError || !adData) {
      throw new Error('Ad not found or could not be fetched.');
    }
    
    // 4. Perform transaction: Add to earnings and log ad view
    const { error: earningsError } = await supabaseClient.rpc('add_earnings_and_log_ad_view', {
      p_user_id: user.id,
      p_ad_id: ad_id,
      p_earned_amount: adData.reward_amount,
    });

    if (earningsError) {
      throw new Error(`Transaction failed: ${earningsError.message}`);
    }

    return new Response(JSON.stringify({ message: 'Reward claimed successfully!' }), {
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

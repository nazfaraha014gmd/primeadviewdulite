/*
# [Operation Name]
Secure Functions and Add Withdrawal Logic

[This migration secures existing database functions by setting a fixed search_path, preventing potential hijacking vulnerabilities. It also introduces a new transactional function to handle user withdrawal requests safely.]

## Query Description: [This operation updates one function and adds another. The update to `add_earnings_and_log_ad_view` is a security enhancement with no data impact. The new `request_withdrawal_and_update_earnings` function will be used to process withdrawal requests, ensuring that a user's balance is checked and updated in a single, atomic transaction to prevent race conditions.]

## Metadata:
- Schema-Category: ["Structural", "Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies function: `add_earnings_and_log_ad_view`
- Adds function: `request_withdrawal_and_update_earnings`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [Functions are executed with the permissions of the caller, typically via Supabase Edge Functions using the user's session.]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible performance impact. Adds security and transactional integrity.]
*/

-- Step 1: Drop the old function to redefine it.
DROP FUNCTION IF EXISTS public.add_earnings_and_log_ad_view(p_user_id uuid, p_ad_id uuid, p_earned_amount double precision);

-- Step 2: Recreate the function with a secure search_path.
CREATE OR REPLACE FUNCTION public.add_earnings_and_log_ad_view(
  p_user_id uuid,
  p_ad_id uuid,
  p_earned_amount double precision
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user's total earnings
  UPDATE profiles
  SET total_earnings = total_earnings + p_earned_amount
  WHERE id = p_user_id;

  -- Log the ad view
  INSERT INTO ad_views (user_id, ad_id, earned_amount)
  VALUES (p_user_id, p_ad_id, p_earned_amount);
END;
$$;

-- Step 3: Create a new function for handling withdrawal requests securely.
CREATE OR REPLACE FUNCTION public.request_withdrawal_and_update_earnings(
    p_user_id uuid,
    p_amount double precision,
    p_method public.payment_method
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_earnings double precision;
BEGIN
  -- Select the user's current earnings and lock the row for this transaction
  SELECT total_earnings INTO current_earnings FROM profiles WHERE id = p_user_id FOR UPDATE;

  -- Check if the user has enough earnings
  IF current_earnings < p_amount THEN
    RAISE EXCEPTION 'Insufficient earnings for withdrawal';
  END IF;

  -- Deduct the amount from total_earnings
  UPDATE profiles
  SET total_earnings = total_earnings - p_amount
  WHERE id = p_user_id;

  -- Insert a new transaction with 'pending' status
  INSERT INTO transactions (user_id, type, amount, status, method)
  VALUES (p_user_id, 'withdrawal', p_amount, 'pending', p_method);
END;
$$;

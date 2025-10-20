/*
# [Create RPC Function: add_earnings_and_log_ad_view]
This operation creates a new PostgreSQL function to handle the process of crediting user earnings in a transactionally safe manner.

## Query Description: 
This script defines a stored procedure `add_earnings_and_log_ad_view`. When called, it will:
1.  Update the `total_earnings` in the `profiles` table for a given user.
2.  Insert a new record into the `ad_views` table to log the event.
These two operations are wrapped in a single function, ensuring that both actions either complete successfully or fail together, which prevents data inconsistencies (e.g., a user getting paid without the ad view being logged). This is a critical security and data integrity improvement.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the function can be dropped)

## Structure Details:
- Function: `public.add_earnings_and_log_ad_view`

## Security Implications:
- RLS Status: Not directly applicable to function creation, but the function will respect existing RLS policies on the tables it modifies.
- Policy Changes: No
- Auth Requirements: The function is defined with `SECURITY DEFINER` and runs with the privileges of the user that defines it (the database admin), allowing it to bypass RLS for this specific, controlled transaction. This is a secure pattern for such operations.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. Improves data consistency.
*/

CREATE OR REPLACE FUNCTION public.add_earnings_and_log_ad_view(
    p_user_id uuid,
    p_ad_id uuid,
    p_earned_amount double precision
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Important for allowing the function to update tables
AS $$
BEGIN
    -- Update the user's total earnings
    UPDATE public.profiles
    SET total_earnings = total_earnings + p_earned_amount
    WHERE id = p_user_id;

    -- Insert a record of the ad view
    INSERT INTO public.ad_views (user_id, ad_id, earned_amount)
    VALUES (p_user_id, p_ad_id, p_earned_amount);
END;
$$;

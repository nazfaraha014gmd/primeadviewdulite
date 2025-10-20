/*
# [Operation Name]
Add Unique Constraints to Packages and Ads

## Query Description: [This migration adds unique constraints to the `name` column of the `packages` table and the `title` column of the `ads` table. This is necessary to prevent duplicate entries and to allow the seeding script to run without errors. This change is non-destructive and safe to apply.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table `public.packages`: Adds a UNIQUE constraint on the `name` column.
- Table `public.ads`: Adds a UNIQUE constraint on the `title` column.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [None]

## Performance Impact:
- Indexes: [Added]
- Triggers: [None]
- Estimated Impact: [Low. Adds two new indexes which may slightly slow down writes but will speed up lookups on these columns.]
*/

-- Add unique constraint to packages name
ALTER TABLE public.packages
ADD CONSTRAINT packages_name_key UNIQUE (name);

-- Add unique constraint to ads title
ALTER TABLE public.ads
ADD CONSTRAINT ads_title_key UNIQUE (title);

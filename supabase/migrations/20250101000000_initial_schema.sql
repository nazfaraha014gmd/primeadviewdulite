/*
          # [Initial Schema Setup: Profiles Table and Auth Trigger]
          This migration sets up the initial database structure for user profiles and integrates it with Supabase Authentication.

          ## Query Description: This script performs the following actions:
          1.  **Creates the `profiles` table:** This table will store public user data that is separate from the sensitive authentication data in `auth.users`. It includes a `full_name` and `avatar_url`.
          2.  **Sets up a trigger `on_auth_user_created`:** This trigger automatically creates a new profile in the `public.profiles` table whenever a new user signs up and is added to `auth.users`. This keeps your user data synchronized.
          3.  **Enables Row Level Security (RLS):** RLS is enabled on the `profiles` table to ensure data privacy and security from the start.
          4.  **Creates RLS Policies:** Policies are created to allow users to view all profiles but only update their own. This is a secure and common pattern for user-managed data.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - **Table Created:** `public.profiles`
            - `id` (UUID, Primary Key, references `auth.users.id`)
            - `created_at` (TIMESTAMPTZ)
            - `full_name` (TEXT)
            - `avatar_url` (TEXT)
          - **Function Created:** `public.handle_new_user()`
          - **Trigger Created:** `on_auth_user_created` on `auth.users`

          ## Security Implications:
          - RLS Status: Enabled on `public.profiles`.
          - Policy Changes: Yes, new policies are created for `SELECT` and `UPDATE` on `public.profiles`.
          - Auth Requirements: Policies are based on the authenticated user's ID (`auth.uid()`).

          ## Performance Impact:
          - Indexes: A primary key index is automatically created on `profiles.id`.
          - Triggers: A trigger is added to `auth.users`, which will have a negligible performance impact on user sign-ups.
          - Estimated Impact: Low.
          */

-- 1. Create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT,
  avatar_url TEXT
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- 2. Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile for a new user.';

-- 3. Create a trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'When a new user signs up, create a corresponding profile.';

-- 4. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Users can view all profiles."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

COMMENT ON POLICY "Users can view all profiles." ON public.profiles IS 'Allows any user to see public profile information.';
COMMENT ON POLICY "Users can insert their own profile." ON public.profiles IS 'Ensures a user can only create their own profile entry.';
COMMENT ON POLICY "Users can update their own profile." ON public.profiles IS 'Restricts profile updates to the owner of the profile.';

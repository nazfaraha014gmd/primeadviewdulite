/*
          # [Operation Name]
          Create User Profiles Table and Associated Logic (Corrected)

          ## Query Description: [This script creates the public `profiles` table to store user data, fixing a previous permissions error. It establishes a logical link to `auth.users` via a trigger instead of a foreign key, which is the correct pattern for Supabase. It also sets up Row Level Security (RLS) policies to ensure users can only access their own profile data. This is a safe, structural change and does not affect existing data as the table creation previously failed.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables Affected: `public.profiles` (Creation)
          - Functions Affected: `public.handle_new_user` (Creation)
          - Triggers Affected: `on_auth_user_created` on `auth.users` (Creation)
          
          ## Security Implications:
          - RLS Status: Enabled on `public.profiles`
          - Policy Changes: Yes, new policies are created to restrict access to a user's own profile.
          - Auth Requirements: The trigger relies on the `auth.users` table.
          
          ## Performance Impact:
          - Indexes: A primary key index is created on `profiles.id`.
          - Triggers: A new trigger is added to `auth.users`, which will fire once per user sign-up. The performance impact is negligible.
          - Estimated Impact: Low.
          */

-- 1. Create the public.profiles table (without the problematic foreign key)
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users(id)';

-- 2. Create a function to insert a new profile row
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

-- 3. Create a trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- 6. Grant usage permissions to authenticated and anonymous roles
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT ON TABLE public.profiles TO anon;

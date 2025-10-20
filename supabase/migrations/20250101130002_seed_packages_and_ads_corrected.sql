/*
# [Operation Name]
Seed Packages and Ads Data (Corrected)

## Query Description: [This script populates the `packages` and `ads` tables with initial data. It uses an `ON CONFLICT` clause to prevent creating duplicate entries if the script is run multiple times. This is safe to run on your database.]

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [false]

## Structure Details:
- Inserts data into `public.packages`.
- Inserts data into `public.ads`.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [None]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Low. Inserts a small number of rows.]
*/

-- Seed Packages Table
INSERT INTO public.packages (name, price, roi_percentage, daily_ads_limit, duration_days) VALUES
('Starter', 10, 150, 5, 30),
('Premium', 50, 200, 15, 90),
('Business', 100, 250, 50, 180)
ON CONFLICT (name) DO NOTHING;

-- Seed Ads Table
-- Note: Using different titles to ensure uniqueness
INSERT INTO public.ads (title, link, duration_seconds, reward_amount) VALUES
('Discover New Music', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 0.10),
('Learn a Skill Today', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 0.12),
('Upgrade Your Tech', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 10, 0.08),
('Fashion for Everyone', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 0.15),
('Travel the World', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 0.18),
('Gourmet Coffee at Home', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 0.10),
('Fitness App Promo', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 0.12),
('New Mobile Game Launch', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 10, 0.08),
('Sustainable Living Products', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 0.15),
('Online Course Offer', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 0.18)
ON CONFLICT (title) DO NOTHING;

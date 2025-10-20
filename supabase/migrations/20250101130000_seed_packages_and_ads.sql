/*
          # [Data Seeding]
          This script inserts initial data into the 'packages' and 'ads' tables.

          ## Query Description: This operation populates the application with essential starting data. It inserts three standard subscription packages and ten sample advertisements. This data is necessary for core features like package activation and ad viewing to function correctly. There is no risk to existing data as this only performs insertions into currently empty tables.
          
          ## Metadata:
          - Schema-Category: ["Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables affected: `packages`, `ads`
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [None for this script]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Negligible. A small number of rows are inserted.]
          */

-- Seed Packages
INSERT INTO public.packages (name, price, roi_percentage, daily_ads_limit, duration_days)
VALUES
('Starter', 10, 150, 5, 30),
('Premium', 50, 200, 15, 90),
('Business', 100, 250, 50, 180)
ON CONFLICT (name) DO NOTHING;

-- Seed Ads
INSERT INTO public.ads (title, link, duration_seconds, reward_amount)
VALUES
('Tech Gadgets Review 2025', 'https://www.youtube.com/watch?v=example1', 30, 0.10),
('Learn Coding in 10 Minutes', 'https://www.youtube.com/watch?v=example2', 60, 0.15),
('Best Travel Destinations', 'https://www.youtube.com/watch?v=example3', 45, 0.12),
('Financial Freedom Guide', 'https://www.youtube.com/watch?v=example4', 90, 0.20),
('New Smartphone Unboxing', 'https://www.youtube.com/watch?v=example5', 25, 0.08),
('Fitness at Home', 'https://www.youtube.com/watch?v=example6', 50, 0.14),
('Cooking Masterclass', 'https://www.youtube.com/watch?v=example7', 75, 0.18),
('DIY Home Projects', 'https://www.youtube.com/watch?v=example8', 40, 0.11),
('Gaming Highlights of the Week', 'https://www.youtube.com/watch?v=example9', 120, 0.25),
('Learn a New Language Fast', 'https://www.youtube.com/watch?v=example10', 55, 0.16)
ON CONFLICT (title) DO NOTHING;

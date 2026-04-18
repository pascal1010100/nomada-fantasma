-- Add optional English fields for tours to support bilingual rendering

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS title_en TEXT;

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS full_description_en TEXT;

-- Seed English copy for Indian Nose tour if it exists.
UPDATE public.tours
SET
  title_en = COALESCE(title_en, 'Indian Nose Sunrise (Mayan Face)'),
  description_en = COALESCE(
    description_en,
    'A short pre-dawn hike to watch the sun rise over Lake Atitlan.'
  ),
  full_description_en = COALESCE(
    full_description_en,
    'Climb the iconic Indian Nose viewpoint for a memorable sunrise over Lake Atitlan and the volcanoes of San Pedro, Toliman, and Atitlan. The tour includes early pickup, a local guide, park access, and a hot drink at the summit.'
  )
WHERE slug = 'amanecer-indian-nose-rostro-maya';

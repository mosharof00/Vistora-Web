-- Richer passport biodata snapshot (BD booklet fields)
ALTER TABLE public.passports
  ADD COLUMN IF NOT EXISTS surname text,
  ADD COLUMN IF NOT EXISTS given_names text,
  ADD COLUMN IF NOT EXISTS full_name_as_in_passport text,
  ADD COLUMN IF NOT EXISTS nationality_label text,
  ADD COLUMN IF NOT EXISTS sex text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS place_of_birth text,
  ADD COLUMN IF NOT EXISTS personal_no text,
  ADD COLUMN IF NOT EXISTS previous_passport_no text,
  ADD COLUMN IF NOT EXISTS issuing_authority text,
  ADD COLUMN IF NOT EXISTS father_name text,
  ADD COLUMN IF NOT EXISTS mother_name text,
  ADD COLUMN IF NOT EXISTS legal_guardian_name text,
  ADD COLUMN IF NOT EXISTS permanent_address text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship text,
  ADD COLUMN IF NOT EXISTS emergency_contact_address text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text;

ALTER TABLE public.passports
  DROP CONSTRAINT IF EXISTS passports_sex_check;

ALTER TABLE public.passports
  ADD CONSTRAINT passports_sex_check
  CHECK (sex IS NULL OR sex IN ('M', 'F', 'X'));

CREATE INDEX IF NOT EXISTS passports_expiry_date_idx
  ON public.passports (expiry_date);

CREATE INDEX IF NOT EXISTS passports_is_current_idx
  ON public.passports (is_current);

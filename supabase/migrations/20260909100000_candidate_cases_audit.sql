-- Track who created/updated candidate cases.
ALTER TABLE public.candidate_cases
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS candidate_cases_created_by_idx
  ON public.candidate_cases (created_by);

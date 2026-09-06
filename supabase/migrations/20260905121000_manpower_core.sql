-- Vistora: manpower core — job categories, orders, visa batches, cases, process steps

CREATE TYPE public.job_order_status AS ENUM (
  'draft',
  'open',
  'fulfilled',
  'closed',
  'cancelled'
);

CREATE TYPE public.visa_batch_status AS ENUM (
  'open',
  'processing',
  'completed',
  'cancelled'
);

CREATE TYPE public.case_overall_status AS ENUM (
  'registered',
  'processing',
  'cleared',
  'ticketed',
  'deployed',
  'cancelled'
);

CREATE TYPE public.process_step_status AS ENUM (
  'pending',
  'in_progress',
  'done',
  'failed',
  'waived',
  'not_required'
);

-- ---------------------------------------------------------------------------
-- Job categories
-- ---------------------------------------------------------------------------
CREATE TABLE public.job_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_categories_slug_key UNIQUE (slug),
  CONSTRAINT job_categories_name_key UNIQUE (name)
);

CREATE TRIGGER job_categories_set_updated_at
  BEFORE UPDATE ON public.job_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Job orders
-- ---------------------------------------------------------------------------
CREATE TABLE public.job_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL,
  employer_company_id uuid NOT NULL REFERENCES public.employer_companies (id) ON DELETE RESTRICT,
  job_category_id uuid NOT NULL REFERENCES public.job_categories (id) ON DELETE RESTRICT,
  title text NOT NULL,
  country_code char(2) NOT NULL,
  required_count integer NOT NULL DEFAULT 1 CHECK (required_count > 0),
  salary_offer_text text,
  salary_bdt numeric(14, 2),
  contract_duration_months integer,
  status public.job_order_status NOT NULL DEFAULT 'draft',
  received_at date,
  notes text,
  created_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_orders_order_code_key UNIQUE (order_code)
);

CREATE INDEX job_orders_employer_company_id_idx ON public.job_orders (employer_company_id);
CREATE INDEX job_orders_status_idx ON public.job_orders (status);

CREATE TRIGGER job_orders_set_updated_at
  BEFORE UPDATE ON public.job_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Visa batches (sheet block: G-49 + visa numbers)
-- ---------------------------------------------------------------------------
CREATE TABLE public.visa_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id uuid NOT NULL REFERENCES public.job_orders (id) ON DELETE RESTRICT,
  batch_code text NOT NULL,
  title text NOT NULL,
  visa_number text,
  visa_id_number text,
  quota_count integer,
  pro_office text,
  status public.visa_batch_status NOT NULL DEFAULT 'open',
  opened_at date,
  closed_at date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT visa_batches_batch_code_per_order UNIQUE (job_order_id, batch_code)
);

CREATE UNIQUE INDEX visa_batches_visa_number_uidx
  ON public.visa_batches (visa_number)
  WHERE visa_number IS NOT NULL;

CREATE INDEX visa_batches_job_order_id_idx ON public.visa_batches (job_order_id);

CREATE TRIGGER visa_batches_set_updated_at
  BEFORE UPDATE ON public.visa_batches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Candidate cases (one spreadsheet row)
-- ---------------------------------------------------------------------------
CREATE TABLE public.candidate_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_code text NOT NULL,
  candidate_id uuid NOT NULL REFERENCES public.candidates (id) ON DELETE RESTRICT,
  visa_batch_id uuid NOT NULL REFERENCES public.visa_batches (id) ON DELETE RESTRICT,
  job_order_id uuid NOT NULL REFERENCES public.job_orders (id) ON DELETE RESTRICT,
  agent_id uuid REFERENCES public.agents (id) ON DELETE SET NULL,
  trade_remark text,
  mofa_number text,
  processing_office text,
  overall_status public.case_overall_status NOT NULL DEFAULT 'registered',
  flight_date date,
  flight_number text,
  deployed_at timestamptz,
  remarks text,
  assigned_staff_id uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidate_cases_case_code_key UNIQUE (case_code),
  CONSTRAINT candidate_cases_candidate_batch_key UNIQUE (candidate_id, visa_batch_id)
);

CREATE INDEX candidate_cases_visa_batch_id_idx ON public.candidate_cases (visa_batch_id);
CREATE INDEX candidate_cases_agent_id_idx ON public.candidate_cases (agent_id);
CREATE INDEX candidate_cases_overall_status_idx ON public.candidate_cases (overall_status);

CREATE TRIGGER candidate_cases_set_updated_at
  BEFORE UPDATE ON public.candidate_cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Process step definitions (seeded)
-- ---------------------------------------------------------------------------
CREATE TABLE public.process_step_defs (
  code text PRIMARY KEY,
  label text NOT NULL,
  sort_order integer NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.process_step_defs (code, label, sort_order, description) VALUES
  ('mofa', 'MOFA', 10, 'Ministry of Foreign Affairs number / approval'),
  ('medical', 'Medical', 20, 'Medical examination'),
  ('fit_card', 'Fit Card', 30, 'Medical fitness card'),
  ('police_clearance', 'Police Clearance', 40, 'Police clearance certificate'),
  ('tasreeh', 'Tasreeh', 50, 'Tasreeh / work authorization'),
  ('takamul', 'Takamul', 60, 'Takamul skill verification'),
  ('visa', 'Visa', 70, 'Work visa status'),
  ('pdo', 'PDO', 80, 'Pre-departure orientation'),
  ('bmet', 'BMET', 90, 'BMET clearance'),
  ('flight', 'Flight', 100, 'Departure flight');

-- ---------------------------------------------------------------------------
-- Case process steps
-- ---------------------------------------------------------------------------
CREATE TABLE public.case_process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_case_id uuid NOT NULL REFERENCES public.candidate_cases (id) ON DELETE CASCADE,
  step_code text NOT NULL REFERENCES public.process_step_defs (code) ON DELETE RESTRICT,
  status public.process_step_status NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  event_date date,
  reference_no text,
  document_id uuid,
  notes text,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT case_process_steps_case_step_key UNIQUE (candidate_case_id, step_code)
);

CREATE INDEX case_process_steps_status_idx ON public.case_process_steps (status);

CREATE TRIGGER case_process_steps_set_updated_at
  BEFORE UPDATE ON public.case_process_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-seed all process steps when a case is created
CREATE OR REPLACE FUNCTION public.seed_case_process_steps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.case_process_steps (candidate_case_id, step_code, status)
  SELECT NEW.id, d.code, 'pending'
  FROM public.process_step_defs d
  WHERE d.is_active = true
  ORDER BY d.sort_order
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER candidate_cases_seed_steps
  AFTER INSERT ON public.candidate_cases
  FOR EACH ROW EXECUTE FUNCTION public.seed_case_process_steps();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_step_defs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_categories_select_authenticated ON public.job_categories
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY job_categories_write_ops ON public.job_categories
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY job_orders_select_internal ON public.job_orders
  FOR SELECT TO authenticated
  USING (public.is_internal_user());

CREATE POLICY job_orders_write_ops ON public.job_orders
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY visa_batches_select_internal ON public.visa_batches
  FOR SELECT TO authenticated
  USING (public.is_internal_user());

CREATE POLICY visa_batches_write_ops ON public.visa_batches
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY candidate_cases_select_internal_or_own ON public.candidate_cases
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR EXISTS (
      SELECT 1 FROM public.candidates c
      WHERE c.id = candidate_cases.candidate_id AND c.auth_user_id = auth.uid()
    )
  );

CREATE POLICY candidate_cases_write_ops ON public.candidate_cases
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY process_step_defs_select_authenticated ON public.process_step_defs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY process_step_defs_write_admin ON public.process_step_defs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY case_process_steps_select_internal_or_own ON public.case_process_steps
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR EXISTS (
      SELECT 1
      FROM public.candidate_cases cc
      JOIN public.candidates c ON c.id = cc.candidate_id
      WHERE cc.id = case_process_steps.candidate_case_id
        AND c.auth_user_id = auth.uid()
    )
  );

CREATE POLICY case_process_steps_write_ops ON public.case_process_steps
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

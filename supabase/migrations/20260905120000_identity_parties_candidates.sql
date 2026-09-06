-- Vistora: identity, auth helpers, agents, employer companies, candidates, passports

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'staff',
  'hr',
  'office_assistant',
  'candidate'
);

CREATE TYPE public.employee_status AS ENUM (
  'active',
  'inactive',
  'terminated'
);

CREATE TYPE public.candidate_status AS ENUM (
  'lead',
  'registered',
  'in_process',
  'deployed',
  'returned',
  'cancelled',
  'blacklisted'
);

CREATE TYPE public.party_status AS ENUM (
  'active',
  'inactive'
);

CREATE TYPE public.candidate_source AS ENUM (
  'direct',
  'agent',
  'walk_in',
  'referral'
);

CREATE TYPE public.gender AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE public.marital_status AS ENUM (
  'single',
  'married',
  'divorced',
  'widowed'
);

CREATE TYPE public.commission_type AS ENUM (
  'fixed',
  'percent',
  'per_candidate'
);

CREATE TYPE public.employee_role AS ENUM (
  'staff',
  'hr',
  'office_assistant'
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Auth helpers (JWT app_metadata.role — Import Mark spine)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'role';
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_internal_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_role() IN ('admin', 'staff', 'hr', 'office_assistant');
$$;

CREATE OR REPLACE FUNCTION public.is_hr_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_role() IN ('admin', 'hr');
$$;

CREATE OR REPLACE FUNCTION public.is_ops_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_role() IN ('admin', 'staff');
$$;

REVOKE ALL ON FUNCTION public.auth_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_internal_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_hr_or_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_ops_user() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.auth_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_internal_user() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_hr_or_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_ops_user() TO authenticated, anon;

-- ---------------------------------------------------------------------------
-- Age helpers (do not store age)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.age_years(dob date)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN dob IS NULL THEN NULL
    ELSE date_part('year', age(current_date, dob))::integer
  END;
$$;

CREATE OR REPLACE FUNCTION public.age_months_remainder(dob date)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN dob IS NULL THEN NULL
    ELSE date_part('month', age(current_date, dob))::integer
  END;
$$;

CREATE OR REPLACE FUNCTION public.age_label(dob date)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN dob IS NULL THEN NULL
    ELSE public.age_years(dob)::text || 'y ' || public.age_months_remainder(dob)::text || 'm'
  END;
$$;

-- ---------------------------------------------------------------------------
-- Agents (non-login)
-- ---------------------------------------------------------------------------
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_code text NOT NULL,
  full_name text NOT NULL,
  agency_name text,
  phone text,
  email text,
  address text,
  district text,
  nid_or_trade_license text,
  commission_type public.commission_type NOT NULL DEFAULT 'per_candidate',
  commission_value numeric(14, 2) NOT NULL DEFAULT 0,
  bank_name text,
  bank_account text,
  status public.party_status NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT agents_agent_code_key UNIQUE (agent_code)
);

CREATE TRIGGER agents_set_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Employer companies (non-login)
-- ---------------------------------------------------------------------------
CREATE TABLE public.employer_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_code text NOT NULL,
  legal_name text NOT NULL,
  trade_name text,
  country_code char(2) NOT NULL,
  city text,
  address text,
  contact_person text,
  contact_phone text,
  contact_email text,
  license_or_cr_number text,
  status public.party_status NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT employer_companies_company_code_key UNIQUE (company_code)
);

CREATE TRIGGER employer_companies_set_updated_at
  BEFORE UPDATE ON public.employer_companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Admins (1:1 auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.admins (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  avatar_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admins_email_key UNIQUE (email)
);

CREATE TRIGGER admins_set_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Employees (staff / hr / office_assistant)
-- ---------------------------------------------------------------------------
CREATE TABLE public.employees (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.employee_role NOT NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  nid text,
  joining_date date,
  department text,
  designation text,
  avatar_path text,
  status public.employee_status NOT NULL DEFAULT 'active',
  basic_salary_bdt numeric(14, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT employees_employee_code_key UNIQUE (employee_code),
  CONSTRAINT employees_email_key UNIQUE (email)
);

CREATE TRIGGER employees_set_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Candidates (auth optional until invite)
-- ---------------------------------------------------------------------------
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  candidate_code text NOT NULL,
  full_name text NOT NULL,
  father_name text,
  mother_name text,
  phone text,
  email text,
  gender public.gender,
  date_of_birth date,
  nationality char(2) NOT NULL DEFAULT 'BD',
  nid_number text,
  marital_status public.marital_status,
  religion text,
  present_address text,
  permanent_address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  photo_path text,
  status public.candidate_status NOT NULL DEFAULT 'lead',
  source public.candidate_source NOT NULL DEFAULT 'direct',
  primary_agent_id uuid REFERENCES public.agents (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidates_candidate_code_key UNIQUE (candidate_code)
);

CREATE INDEX candidates_primary_agent_id_idx ON public.candidates (primary_agent_id);
CREATE INDEX candidates_status_idx ON public.candidates (status);
CREATE INDEX candidates_date_of_birth_idx ON public.candidates (date_of_birth);

CREATE TRIGGER candidates_set_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE VIEW public.candidates_with_age AS
SELECT
  c.*,
  public.age_years(c.date_of_birth) AS age_years,
  public.age_months_remainder(c.date_of_birth) AS age_months,
  public.age_label(c.date_of_birth) AS age_label
FROM public.candidates c;

-- ---------------------------------------------------------------------------
-- Passports (history; one current per candidate)
-- ---------------------------------------------------------------------------
CREATE TABLE public.passports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidates (id) ON DELETE CASCADE,
  passport_number text NOT NULL,
  passport_type text NOT NULL DEFAULT 'ordinary',
  issuing_country char(2) NOT NULL DEFAULT 'BD',
  issue_date date,
  expiry_date date,
  place_of_issue text,
  mrz_line1 text,
  mrz_line2 text,
  scan_front_path text,
  scan_back_path text,
  is_current boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX passports_current_per_candidate_idx
  ON public.passports (candidate_id)
  WHERE is_current = true;

CREATE UNIQUE INDEX passports_number_active_idx
  ON public.passports (passport_number)
  WHERE is_current = true;

CREATE INDEX passports_candidate_id_idx ON public.passports (candidate_id);

CREATE TRIGGER passports_set_updated_at
  BEFORE UPDATE ON public.passports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Email-confirm trigger: ensure profile rows exist
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_auth_user_email_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  user_role text;
  meta jsonb;
BEGIN
  IF OLD.email_confirmed_at IS NOT NULL OR NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

  user_role := NEW.raw_app_meta_data ->> 'role';
  meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  IF user_role = 'admin' THEN
    INSERT INTO public.admins (id, email, full_name, phone, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(meta ->> 'full_name', 'Admin'),
      NULLIF(meta ->> 'phone', ''),
      true
    )
    ON CONFLICT (id) DO NOTHING;

  ELSIF user_role IN ('staff', 'hr', 'office_assistant') THEN
    INSERT INTO public.employees (
      id, role, employee_code, full_name, email, phone, status
    )
    VALUES (
      NEW.id,
      user_role::public.employee_role,
      COALESCE(NULLIF(meta ->> 'employee_code', ''), 'EMP-' || substr(NEW.id::text, 1, 8)),
      COALESCE(meta ->> 'full_name', 'Employee'),
      NEW.email,
      NULLIF(meta ->> 'phone', ''),
      'active'
    )
    ON CONFLICT (id) DO NOTHING;

  ELSIF user_role = 'candidate' THEN
    -- Link existing candidate by email if present; else create shell
    UPDATE public.candidates
    SET auth_user_id = NEW.id,
        email = COALESCE(email, NEW.email),
        updated_at = now()
    WHERE auth_user_id IS NULL
      AND email IS NOT NULL
      AND lower(email) = lower(NEW.email);

    IF NOT FOUND THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.candidates WHERE auth_user_id = NEW.id
      ) THEN
        INSERT INTO public.candidates (
          auth_user_id, candidate_code, full_name, email, phone, status, source
        )
        VALUES (
          NEW.id,
          COALESCE(NULLIF(meta ->> 'candidate_code', ''), 'CAND-' || substr(NEW.id::text, 1, 8)),
          COALESCE(meta ->> 'full_name', 'Candidate'),
          NEW.email,
          NULLIF(meta ->> 'phone', ''),
          'registered',
          'direct'
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_auth_user_email_confirmed() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_auth_user_email_confirmed() TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_email_confirmed();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;

-- Agents / employers: internal read/write; admin full
CREATE POLICY agents_select_internal ON public.agents
  FOR SELECT TO authenticated
  USING (public.is_internal_user());

CREATE POLICY agents_write_ops ON public.agents
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY employer_companies_select_internal ON public.employer_companies
  FOR SELECT TO authenticated
  USING (public.is_internal_user());

CREATE POLICY employer_companies_write_ops ON public.employer_companies
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

-- Admins
CREATE POLICY admins_select_own_or_admin ON public.admins
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY admins_update_own_or_admin ON public.admins
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY admins_insert_admin ON public.admins
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Employees
CREATE POLICY employees_select_hr_admin_or_own ON public.employees
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_hr_or_admin() OR public.is_ops_user());

CREATE POLICY employees_update_hr_admin_or_own ON public.employees
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_hr_or_admin())
  WITH CHECK (id = auth.uid() OR public.is_hr_or_admin());

CREATE POLICY employees_insert_hr_admin ON public.employees
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_or_admin());

CREATE POLICY employees_delete_admin ON public.employees
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Candidates
CREATE POLICY candidates_select_internal_or_own ON public.candidates
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR auth_user_id = auth.uid()
  );

CREATE POLICY candidates_insert_ops ON public.candidates
  FOR INSERT TO authenticated
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY candidates_update_ops_or_own ON public.candidates
  FOR UPDATE TO authenticated
  USING (public.is_ops_user() OR public.is_admin() OR auth_user_id = auth.uid())
  WITH CHECK (public.is_ops_user() OR public.is_admin() OR auth_user_id = auth.uid());

CREATE POLICY candidates_delete_admin ON public.candidates
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Passports
CREATE POLICY passports_select_internal_or_own ON public.passports
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR EXISTS (
      SELECT 1 FROM public.candidates c
      WHERE c.id = passports.candidate_id AND c.auth_user_id = auth.uid()
    )
  );

CREATE POLICY passports_write_ops ON public.passports
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

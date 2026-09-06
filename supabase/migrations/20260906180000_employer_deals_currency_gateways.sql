-- Vistora: employer deals, quota, multi-currency, payment gateways, RLS tighten

-- ---------------------------------------------------------------------------
-- Currencies
-- ---------------------------------------------------------------------------
CREATE TABLE public.currencies (
  code char(3) PRIMARY KEY,
  name text NOT NULL,
  symbol text NOT NULL,
  decimal_places smallint NOT NULL DEFAULT 2,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.currencies (code, name, symbol, decimal_places) VALUES
  ('BDT', 'Bangladeshi Taka', '৳', 2),
  ('SAR', 'Saudi Riyal', '﷼', 2),
  ('AED', 'UAE Dirham', 'د.إ', 2),
  ('QAR', 'Qatari Riyal', 'ر.ق', 2),
  ('OMR', 'Omani Rial', 'ر.ع.', 3),
  ('KWD', 'Kuwaiti Dinar', 'د.ك', 3),
  ('BHD', 'Bahraini Dinar', 'د.ب', 3),
  ('USD', 'US Dollar', '$', 2),
  ('EUR', 'Euro', '€', 2),
  ('MYR', 'Malaysian Ringgit', 'RM', 2),
  ('SGD', 'Singapore Dollar', 'S$', 2);

ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY currencies_select_authenticated ON public.currencies
  FOR SELECT TO authenticated USING (true);
CREATE POLICY currencies_write_admin ON public.currencies
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Document types for employer deals
-- ---------------------------------------------------------------------------
ALTER TYPE public.document_type ADD VALUE IF NOT EXISTS 'demand_letter';
ALTER TYPE public.document_type ADD VALUE IF NOT EXISTS 'visa_advice';
ALTER TYPE public.document_type ADD VALUE IF NOT EXISTS 'employer_other';
ALTER TYPE public.document_type ADD VALUE IF NOT EXISTS 'ticket_go';
ALTER TYPE public.document_type ADD VALUE IF NOT EXISTS 'ticket_return';

-- ---------------------------------------------------------------------------
-- Ticket provision enum
-- ---------------------------------------------------------------------------
CREATE TYPE public.ticket_provision AS ENUM (
  'none',
  'go_only',
  'return_only',
  'go_and_return'
);

-- ---------------------------------------------------------------------------
-- Job orders: multi-currency salary, tickets, filled quota
-- ---------------------------------------------------------------------------
ALTER TABLE public.job_orders
  ADD COLUMN IF NOT EXISTS salary_amount numeric(14, 2),
  ADD COLUMN IF NOT EXISTS salary_currency_code char(3) REFERENCES public.currencies (code),
  ADD COLUMN IF NOT EXISTS filled_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ticket_provision public.ticket_provision NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS demand_letter_document_id uuid REFERENCES public.documents (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS visa_advice_document_id uuid REFERENCES public.documents (id) ON DELETE SET NULL;

COMMENT ON COLUMN public.job_orders.salary_amount IS 'Monthly salary in destination currency (candidate-facing)';
COMMENT ON COLUMN public.job_orders.filled_count IS 'Assigned candidates; remaining = required_count - filled_count';

CREATE OR REPLACE FUNCTION public.job_order_remaining(required integer, filled integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT GREATEST(required - filled, 0);
$$;

-- Keep filled_count in sync with candidate_cases
CREATE OR REPLACE FUNCTION public.sync_job_order_filled_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_ids uuid[];
BEGIN
  IF TG_OP = 'DELETE' THEN
    order_ids := ARRAY[OLD.job_order_id];
  ELSIF TG_OP = 'UPDATE' AND OLD.job_order_id IS DISTINCT FROM NEW.job_order_id THEN
    order_ids := ARRAY[OLD.job_order_id, NEW.job_order_id];
  ELSE
    order_ids := ARRAY[NEW.job_order_id];
  END IF;

  UPDATE public.job_orders jo
  SET filled_count = (
        SELECT count(*)::integer
        FROM public.candidate_cases cc
        WHERE cc.job_order_id = jo.id
          AND cc.overall_status <> 'cancelled'
      ),
      updated_at = now()
  WHERE jo.id = ANY (order_ids);

  -- Prevent over-assignment on insert
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.job_order_id IS DISTINCT FROM NEW.job_order_id) THEN
    IF EXISTS (
      SELECT 1 FROM public.job_orders jo
      WHERE jo.id = NEW.job_order_id
        AND jo.filled_count > jo.required_count
    ) THEN
      RAISE EXCEPTION 'Job order quota exceeded (required_count)';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS candidate_cases_sync_filled ON public.candidate_cases;
CREATE TRIGGER candidate_cases_sync_filled
  AFTER INSERT OR UPDATE OF job_order_id, overall_status OR DELETE
  ON public.candidate_cases
  FOR EACH ROW EXECUTE FUNCTION public.sync_job_order_filled_count();

-- Visa batch filled similarly
ALTER TABLE public.visa_batches
  ADD COLUMN IF NOT EXISTS filled_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.sync_visa_batch_filled_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  batch_ids uuid[];
BEGIN
  IF TG_OP = 'DELETE' THEN
    batch_ids := ARRAY[OLD.visa_batch_id];
  ELSIF TG_OP = 'UPDATE' AND OLD.visa_batch_id IS DISTINCT FROM NEW.visa_batch_id THEN
    batch_ids := ARRAY[OLD.visa_batch_id, NEW.visa_batch_id];
  ELSE
    batch_ids := ARRAY[NEW.visa_batch_id];
  END IF;

  UPDATE public.visa_batches vb
  SET filled_count = (
        SELECT count(*)::integer
        FROM public.candidate_cases cc
        WHERE cc.visa_batch_id = vb.id
          AND cc.overall_status <> 'cancelled'
      ),
      updated_at = now()
  WHERE vb.id = ANY (batch_ids);

  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.visa_batch_id IS DISTINCT FROM NEW.visa_batch_id) THEN
    IF EXISTS (
      SELECT 1 FROM public.visa_batches vb
      WHERE vb.id = NEW.visa_batch_id
        AND vb.quota_count IS NOT NULL
        AND vb.filled_count > vb.quota_count
    ) THEN
      RAISE EXCEPTION 'Visa batch quota exceeded (quota_count)';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS candidate_cases_sync_batch_filled ON public.candidate_cases;
CREATE TRIGGER candidate_cases_sync_batch_filled
  AFTER INSERT OR UPDATE OF visa_batch_id, overall_status OR DELETE
  ON public.candidate_cases
  FOR EACH ROW EXECUTE FUNCTION public.sync_visa_batch_filled_count();

REVOKE EXECUTE ON FUNCTION public.sync_job_order_filled_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_visa_batch_filled_count() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Payment gateways (admin-managed)
-- ---------------------------------------------------------------------------
CREATE TYPE public.gateway_kind AS ENUM (
  'cash',
  'bank',
  'bkash',
  'nagad',
  'card',
  'other'
);

CREATE TABLE public.payment_gateways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  kind public.gateway_kind NOT NULL DEFAULT 'cash',
  account_name text,
  account_number text,
  bank_name text,
  branch_name text,
  instructions text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER payment_gateways_set_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.payment_gateways (code, name, kind, sort_order) VALUES
  ('cash', 'Cash', 'cash', 10),
  ('bank_transfer', 'Bank Transfer', 'bank', 20),
  ('bkash', 'bKash', 'bkash', 30),
  ('nagad', 'Nagad', 'nagad', 40);

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
CREATE POLICY payment_gateways_select_authenticated ON public.payment_gateways
  FOR SELECT TO authenticated USING (true);
CREATE POLICY payment_gateways_write_admin ON public.payment_gateways
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Candidate payments: gateway + multi-currency amount
-- ---------------------------------------------------------------------------
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS payment_gateway_id uuid REFERENCES public.payment_gateways (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS amount numeric(14, 2),
  ADD COLUMN IF NOT EXISTS currency_code char(3) REFERENCES public.currencies (code);

UPDATE public.payments
SET amount = amount_bdt,
    currency_code = COALESCE(NULLIF(currency, ''), 'BDT')
WHERE amount IS NULL;

ALTER TABLE public.payments
  ALTER COLUMN amount SET DEFAULT 0,
  ALTER COLUMN currency_code SET DEFAULT 'BDT';

-- ---------------------------------------------------------------------------
-- Company investment / settlement payments (Vistora <-> employer)
-- ---------------------------------------------------------------------------
CREATE TYPE public.company_payment_kind AS ENUM (
  'investment_out',
  'reimbursement_in',
  'fee_in',
  'other'
);

CREATE TABLE public.company_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_company_id uuid NOT NULL REFERENCES public.employer_companies (id) ON DELETE RESTRICT,
  job_order_id uuid REFERENCES public.job_orders (id) ON DELETE SET NULL,
  kind public.company_payment_kind NOT NULL DEFAULT 'investment_out',
  amount numeric(14, 2) NOT NULL CHECK (amount >= 0),
  currency_code char(3) NOT NULL DEFAULT 'BDT' REFERENCES public.currencies (code),
  amount_bdt numeric(14, 2),
  payment_gateway_id uuid REFERENCES public.payment_gateways (id) ON DELETE SET NULL,
  method public.payment_method NOT NULL DEFAULT 'bank',
  reference_no text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  proof_document_id uuid REFERENCES public.documents (id) ON DELETE SET NULL,
  notes text,
  recorded_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX company_payments_employer_idx ON public.company_payments (employer_company_id);
CREATE INDEX company_payments_paid_at_idx ON public.company_payments (paid_at);

CREATE TRIGGER company_payments_set_updated_at
  BEFORE UPDATE ON public.company_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.company_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_payments_select_ops ON public.company_payments
  FOR SELECT TO authenticated USING (public.is_ops_user() OR public.is_admin());
CREATE POLICY company_payments_write_ops ON public.company_payments
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

-- ---------------------------------------------------------------------------
-- RLS: only Admin creates/edits agents & employer companies
-- Staff may still SELECT. Staff creates candidates (already ops).
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS agents_write_ops ON public.agents;
CREATE POLICY agents_write_admin ON public.agents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS employer_companies_write_ops ON public.employer_companies;
CREATE POLICY employer_companies_write_admin ON public.employer_companies
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Staff can write job orders / batches / cases (ops); admin also
-- (existing policies already use is_ops_user which includes admin)

-- Candidate salary view for profile (destination currency from job order)
CREATE OR REPLACE VIEW public.candidate_case_salary
WITH (security_invoker = true)
AS
SELECT
  cc.id AS candidate_case_id,
  cc.candidate_id,
  jo.id AS job_order_id,
  jo.salary_amount,
  jo.salary_currency_code,
  cur.symbol AS salary_currency_symbol,
  cur.name AS salary_currency_name,
  jo.ticket_provision,
  jo.required_count,
  jo.filled_count,
  public.job_order_remaining(jo.required_count, jo.filled_count) AS remaining_seats
FROM public.candidate_cases cc
JOIN public.job_orders jo ON jo.id = cc.job_order_id
LEFT JOIN public.currencies cur ON cur.code = jo.salary_currency_code;

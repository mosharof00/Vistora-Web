-- Vistora: HR attendance/leave/salary + BDT finance

CREATE TYPE public.attendance_day_status AS ENUM (
  'present',
  'absent',
  'late',
  'half_day',
  'weekend',
  'holiday',
  'leave'
);

CREATE TYPE public.punch_type AS ENUM ('in', 'out');

CREATE TYPE public.punch_source AS ENUM ('manual', 'device', 'app');

CREATE TYPE public.leave_request_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'cancelled'
);

CREATE TYPE public.salary_month_status AS ENUM (
  'draft',
  'finalized',
  'paid'
);

CREATE TYPE public.payment_method AS ENUM (
  'cash',
  'bkash',
  'nagad',
  'bank',
  'other'
);

CREATE TYPE public.payment_direction AS ENUM (
  'in',
  'out'
);

CREATE TYPE public.commission_status AS ENUM (
  'pending',
  'approved',
  'paid',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- Holidays
-- ---------------------------------------------------------------------------
CREATE TABLE public.holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_date date NOT NULL UNIQUE,
  name text NOT NULL,
  is_optional boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Leave types & requests
-- ---------------------------------------------------------------------------
CREATE TABLE public.leave_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_paid boolean NOT NULL DEFAULT true,
  annual_allowance_days numeric(5, 1),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.leave_types (code, name, is_paid, annual_allowance_days) VALUES
  ('casual', 'Casual Leave', true, 10),
  ('sick', 'Sick Leave', true, 14),
  ('unpaid', 'Unpaid Leave', false, NULL),
  ('annual', 'Annual Leave', true, 15);

CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  leave_type_id uuid NOT NULL REFERENCES public.leave_types (id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days numeric(5, 1) NOT NULL,
  reason text,
  status public.leave_request_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leave_requests_dates CHECK (end_date >= start_date)
);

CREATE TRIGGER leave_requests_set_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
CREATE TABLE public.attendance_punches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  punched_at timestamptz NOT NULL DEFAULT now(),
  punch_type public.punch_type NOT NULL,
  source public.punch_source NOT NULL DEFAULT 'manual',
  recorded_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX attendance_punches_employee_day_idx
  ON public.attendance_punches (employee_id, punched_at);

CREATE TABLE public.attendance_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  work_date date NOT NULL,
  status public.attendance_day_status NOT NULL DEFAULT 'absent',
  check_in_at timestamptz,
  check_out_at timestamptz,
  late_minutes integer NOT NULL DEFAULT 0,
  overtime_minutes integer NOT NULL DEFAULT 0,
  leave_id uuid REFERENCES public.leave_requests (id) ON DELETE SET NULL,
  source public.punch_source NOT NULL DEFAULT 'manual',
  edited_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT attendance_days_employee_date_key UNIQUE (employee_id, work_date)
);

CREATE INDEX attendance_days_work_date_idx ON public.attendance_days (work_date);

CREATE TRIGGER attendance_days_set_updated_at
  BEFORE UPDATE ON public.attendance_days
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Salary
-- ---------------------------------------------------------------------------
CREATE TABLE public.salary_months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees (id) ON DELETE CASCADE,
  year integer NOT NULL CHECK (year >= 2020),
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  present_days numeric(5, 1) NOT NULL DEFAULT 0,
  absent_days numeric(5, 1) NOT NULL DEFAULT 0,
  leave_days numeric(5, 1) NOT NULL DEFAULT 0,
  late_count integer NOT NULL DEFAULT 0,
  overtime_minutes integer NOT NULL DEFAULT 0,
  basic_salary_bdt numeric(14, 2) NOT NULL DEFAULT 0,
  allowances_bdt numeric(14, 2) NOT NULL DEFAULT 0,
  deductions_bdt numeric(14, 2) NOT NULL DEFAULT 0,
  net_salary_bdt numeric(14, 2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  status public.salary_month_status NOT NULL DEFAULT 'draft',
  finalized_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT salary_months_employee_period_key UNIQUE (employee_id, year, month)
);

CREATE TRIGGER salary_months_set_updated_at
  BEFORE UPDATE ON public.salary_months
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.salary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salary_month_id uuid NOT NULL REFERENCES public.salary_months (id) ON DELETE CASCADE,
  label text NOT NULL,
  amount_bdt numeric(14, 2) NOT NULL,
  is_deduction boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Finance (BDT)
-- ---------------------------------------------------------------------------
CREATE TABLE public.fee_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code char(2),
  job_category_id uuid REFERENCES public.job_categories (id) ON DELETE SET NULL,
  fee_code text NOT NULL,
  amount_bdt numeric(14, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'BDT',
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fee_schedules_fee_code_key UNIQUE (fee_code)
);

CREATE TRIGGER fee_schedules_set_updated_at
  BEFORE UPDATE ON public.fee_schedules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_case_id uuid REFERENCES public.candidate_cases (id) ON DELETE SET NULL,
  candidate_id uuid REFERENCES public.candidates (id) ON DELETE SET NULL,
  direction public.payment_direction NOT NULL DEFAULT 'in',
  amount_bdt numeric(14, 2) NOT NULL CHECK (amount_bdt >= 0),
  currency text NOT NULL DEFAULT 'BDT',
  method public.payment_method NOT NULL DEFAULT 'cash',
  reference_no text,
  fee_schedule_id uuid REFERENCES public.fee_schedules (id) ON DELETE SET NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  recorded_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  document_id uuid REFERENCES public.documents (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX payments_candidate_case_id_idx ON public.payments (candidate_case_id);
CREATE INDEX payments_received_at_idx ON public.payments (received_at);

CREATE TRIGGER payments_set_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.agent_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents (id) ON DELETE RESTRICT,
  candidate_case_id uuid NOT NULL REFERENCES public.candidate_cases (id) ON DELETE RESTRICT,
  amount_bdt numeric(14, 2) NOT NULL CHECK (amount_bdt >= 0),
  currency text NOT NULL DEFAULT 'BDT',
  status public.commission_status NOT NULL DEFAULT 'pending',
  milestone_step text REFERENCES public.process_step_defs (code) ON DELETE SET NULL,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX agent_commissions_agent_id_idx ON public.agent_commissions (agent_id);

CREATE TRIGGER agent_commissions_set_updated_at
  BEFORE UPDATE ON public.agent_commissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_case_id uuid REFERENCES public.candidate_cases (id) ON DELETE SET NULL,
  visa_batch_id uuid REFERENCES public.visa_batches (id) ON DELETE SET NULL,
  category text NOT NULL,
  vendor_name text,
  amount_bdt numeric(14, 2) NOT NULL CHECK (amount_bdt >= 0),
  currency text NOT NULL DEFAULT 'BDT',
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  recorded_by uuid REFERENCES public.employees (id) ON DELETE SET NULL,
  document_id uuid REFERENCES public.documents (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER expenses_set_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_punches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY holidays_select_internal ON public.holidays
  FOR SELECT TO authenticated USING (public.is_internal_user());
CREATE POLICY holidays_write_hr ON public.holidays
  FOR ALL TO authenticated
  USING (public.is_hr_or_admin()) WITH CHECK (public.is_hr_or_admin());

CREATE POLICY leave_types_select_internal ON public.leave_types
  FOR SELECT TO authenticated USING (public.is_internal_user());
CREATE POLICY leave_types_write_hr ON public.leave_types
  FOR ALL TO authenticated
  USING (public.is_hr_or_admin()) WITH CHECK (public.is_hr_or_admin());

CREATE POLICY leave_requests_select ON public.leave_requests
  FOR SELECT TO authenticated
  USING (employee_id = auth.uid() OR public.is_hr_or_admin());
CREATE POLICY leave_requests_insert_own ON public.leave_requests
  FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR public.is_hr_or_admin());
CREATE POLICY leave_requests_update ON public.leave_requests
  FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR public.is_hr_or_admin())
  WITH CHECK (employee_id = auth.uid() OR public.is_hr_or_admin());

CREATE POLICY attendance_punches_select ON public.attendance_punches
  FOR SELECT TO authenticated
  USING (
    employee_id = auth.uid()
    OR public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
  );
CREATE POLICY attendance_punches_write ON public.attendance_punches
  FOR ALL TO authenticated
  USING (
    public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
    OR employee_id = auth.uid()
  )
  WITH CHECK (
    public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
    OR employee_id = auth.uid()
  );

CREATE POLICY attendance_days_select ON public.attendance_days
  FOR SELECT TO authenticated
  USING (
    employee_id = auth.uid()
    OR public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
  );
CREATE POLICY attendance_days_write ON public.attendance_days
  FOR ALL TO authenticated
  USING (
    public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
  )
  WITH CHECK (
    public.is_hr_or_admin()
    OR public.auth_role() = 'office_assistant'
  );

CREATE POLICY salary_months_select ON public.salary_months
  FOR SELECT TO authenticated
  USING (employee_id = auth.uid() OR public.is_hr_or_admin());
CREATE POLICY salary_months_write_hr ON public.salary_months
  FOR ALL TO authenticated
  USING (public.is_hr_or_admin()) WITH CHECK (public.is_hr_or_admin());

CREATE POLICY salary_items_select ON public.salary_items
  FOR SELECT TO authenticated
  USING (
    public.is_hr_or_admin()
    OR EXISTS (
      SELECT 1 FROM public.salary_months sm
      WHERE sm.id = salary_items.salary_month_id AND sm.employee_id = auth.uid()
    )
  );
CREATE POLICY salary_items_write_hr ON public.salary_items
  FOR ALL TO authenticated
  USING (public.is_hr_or_admin()) WITH CHECK (public.is_hr_or_admin());

CREATE POLICY fee_schedules_select_ops ON public.fee_schedules
  FOR SELECT TO authenticated USING (public.is_ops_user() OR public.is_admin());
CREATE POLICY fee_schedules_write_ops ON public.fee_schedules
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY payments_select_ops ON public.payments
  FOR SELECT TO authenticated
  USING (
    public.is_ops_user() OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.candidates c
      WHERE c.id = payments.candidate_id AND c.auth_user_id = auth.uid()
    )
  );
CREATE POLICY payments_write_ops ON public.payments
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY agent_commissions_select_ops ON public.agent_commissions
  FOR SELECT TO authenticated USING (public.is_ops_user() OR public.is_admin());
CREATE POLICY agent_commissions_write_ops ON public.agent_commissions
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

CREATE POLICY expenses_select_ops ON public.expenses
  FOR SELECT TO authenticated USING (public.is_ops_user() OR public.is_admin());
CREATE POLICY expenses_write_ops ON public.expenses
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin());

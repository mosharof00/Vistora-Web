-- Security hardening: invoker view, search_path, revoke anon execute

DROP VIEW IF EXISTS public.candidates_with_age;
CREATE VIEW public.candidates_with_age
WITH (security_invoker = true)
AS
SELECT
  c.*,
  public.age_years(c.date_of_birth) AS age_years,
  public.age_months_remainder(c.date_of_birth) AS age_months,
  public.age_label(c.date_of_birth) AS age_label
FROM public.candidates c;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.age_years(dob date)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = public
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
SET search_path = public
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
SET search_path = public
AS $$
  SELECT CASE
    WHEN dob IS NULL THEN NULL
    ELSE public.age_years(dob)::text || 'y ' || public.age_months_remainder(dob)::text || 'm'
  END;
$$;

REVOKE EXECUTE ON FUNCTION public.auth_role() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_internal_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_hr_or_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_ops_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.auth_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_internal_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_hr_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_ops_user() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_auth_user_email_confirmed() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_auth_user_email_confirmed() TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.seed_case_process_steps() FROM PUBLIC, anon, authenticated;

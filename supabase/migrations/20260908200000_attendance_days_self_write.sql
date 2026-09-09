-- Allow employees (incl. staff) to upsert their own attendance day rows
DROP POLICY IF EXISTS attendance_days_write ON public.attendance_days;

CREATE POLICY attendance_days_write ON public.attendance_days
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

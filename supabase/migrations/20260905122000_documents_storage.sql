-- Vistora: documents registry + storage buckets + policies

CREATE TYPE public.document_owner_type AS ENUM (
  'candidate',
  'case',
  'agent',
  'employer_company',
  'employee',
  'job_order'
);

CREATE TYPE public.document_type AS ENUM (
  'passport_scan',
  'nid',
  'photo',
  'medical_report',
  'fit_card',
  'police_clearance',
  'visa',
  'contract',
  'bmet_card',
  'ticket',
  'payment_proof',
  'other'
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type public.document_owner_type NOT NULL,
  owner_id uuid NOT NULL,
  doc_type public.document_type NOT NULL DEFAULT 'other',
  file_name text NOT NULL,
  storage_bucket text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  byte_size bigint,
  checksum_sha256 text,
  width integer,
  height integer,
  is_optimized boolean NOT NULL DEFAULT false,
  is_original boolean NOT NULL DEFAULT true,
  uploaded_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT documents_storage_path_key UNIQUE (storage_bucket, storage_path)
);

CREATE INDEX documents_owner_idx ON public.documents (owner_type, owner_id);
CREATE INDEX documents_doc_type_idx ON public.documents (doc_type);

CREATE TRIGGER documents_set_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Link case_process_steps.document_id now that documents exists
ALTER TABLE public.case_process_steps
  ADD CONSTRAINT case_process_steps_document_id_fkey
  FOREIGN KEY (document_id) REFERENCES public.documents (id) ON DELETE SET NULL;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_select_internal_or_own ON public.documents
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR (
      owner_type = 'candidate'
      AND EXISTS (
        SELECT 1 FROM public.candidates c
        WHERE c.id = documents.owner_id AND c.auth_user_id = auth.uid()
      )
    )
    OR (
      owner_type = 'case'
      AND EXISTS (
        SELECT 1
        FROM public.candidate_cases cc
        JOIN public.candidates c ON c.id = cc.candidate_id
        WHERE cc.id = documents.owner_id AND c.auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY documents_write_ops ON public.documents
  FOR ALL TO authenticated
  USING (public.is_ops_user() OR public.is_admin() OR public.is_hr_or_admin())
  WITH CHECK (public.is_ops_user() OR public.is_admin() OR public.is_hr_or_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
-- Path convention: {bucket}/{yyyy}/{mm}/{owner_type}/{owner_id}/{doc_type}/{uuid}.ext
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]),
  ('passports', 'passports', false, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]),
  ('case-docs', 'case-docs', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]),
  ('contracts', 'contracts', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]),
  ('finance-proofs', 'finance-proofs', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]),
  ('marketing', 'marketing', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']::text[])
ON CONFLICT (id) DO NOTHING;

-- Internal staff can manage private buckets
CREATE POLICY storage_private_select_internal ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('avatars', 'passports', 'case-docs', 'contracts', 'finance-proofs')
    AND public.is_internal_user()
  );

CREATE POLICY storage_private_write_ops ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id IN ('avatars', 'passports', 'case-docs', 'contracts', 'finance-proofs')
    AND (public.is_ops_user() OR public.is_admin() OR public.is_hr_or_admin())
  )
  WITH CHECK (
    bucket_id IN ('avatars', 'passports', 'case-docs', 'contracts', 'finance-proofs')
    AND (public.is_ops_user() OR public.is_admin() OR public.is_hr_or_admin())
  );

-- Candidates: read own folder under avatars / passports / case-docs
-- Path includes owner uuid: .../candidate/{candidate_id}/... or .../case/{case_id}/...
CREATE POLICY storage_candidate_read_own ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('avatars', 'passports', 'case-docs')
    AND public.auth_role() = 'candidate'
    AND (
      name LIKE '%' || (
        SELECT c.id::text FROM public.candidates c WHERE c.auth_user_id = auth.uid() LIMIT 1
      ) || '%'
      OR name LIKE '%' || (
        SELECT cc.id::text
        FROM public.candidate_cases cc
        JOIN public.candidates c ON c.id = cc.candidate_id
        WHERE c.auth_user_id = auth.uid()
        LIMIT 1
      ) || '%'
    )
  );

-- Own avatar upload for any authenticated user under their auth uid folder
CREATE POLICY storage_avatars_own_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (name LIKE '%/' || auth.uid()::text || '/%' OR public.is_internal_user())
  );

CREATE POLICY storage_avatars_own_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (name LIKE '%/' || auth.uid()::text || '/%' OR public.is_internal_user())
  );

-- Marketing: public read
CREATE POLICY storage_marketing_public_read ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'marketing');

CREATE POLICY storage_marketing_write_admin ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'marketing' AND public.is_admin())
  WITH CHECK (bucket_id = 'marketing' AND public.is_admin());

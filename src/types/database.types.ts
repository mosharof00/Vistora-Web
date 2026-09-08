export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          avatar_path: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      agent_commissions: {
        Row: {
          agent_id: string
          amount_bdt: number
          candidate_case_id: string
          created_at: string
          currency: string
          id: string
          milestone_step: string | null
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["commission_status"]
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount_bdt: number
          candidate_case_id: string
          created_at?: string
          currency?: string
          id?: string
          milestone_step?: string | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount_bdt?: number
          candidate_case_id?: string
          created_at?: string
          currency?: string
          id?: string
          milestone_step?: string | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["candidate_case_id"]
          },
          {
            foreignKeyName: "agent_commissions_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_milestone_step_fkey"
            columns: ["milestone_step"]
            isOneToOne: false
            referencedRelation: "process_step_defs"
            referencedColumns: ["code"]
          },
        ]
      }
      agents: {
        Row: {
          address: string | null
          agency_name: string | null
          agent_code: string
          bank_account: string | null
          bank_name: string | null
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at: string
          district: string | null
          email: string | null
          full_name: string
          id: string
          nid_or_trade_license: string | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["party_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          agency_name?: string | null
          agent_code: string
          bank_account?: string | null
          bank_name?: string | null
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          nid_or_trade_license?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["party_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          agency_name?: string | null
          agent_code?: string
          bank_account?: string | null
          bank_name?: string | null
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          nid_or_trade_license?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["party_status"]
          updated_at?: string
        }
        Relationships: []
      }
      attendance_days: {
        Row: {
          check_in_at: string | null
          check_out_at: string | null
          created_at: string
          edited_by: string | null
          employee_id: string
          id: string
          late_minutes: number
          leave_id: string | null
          notes: string | null
          overtime_minutes: number
          source: Database["public"]["Enums"]["punch_source"]
          status: Database["public"]["Enums"]["attendance_day_status"]
          updated_at: string
          work_date: string
        }
        Insert: {
          check_in_at?: string | null
          check_out_at?: string | null
          created_at?: string
          edited_by?: string | null
          employee_id: string
          id?: string
          late_minutes?: number
          leave_id?: string | null
          notes?: string | null
          overtime_minutes?: number
          source?: Database["public"]["Enums"]["punch_source"]
          status?: Database["public"]["Enums"]["attendance_day_status"]
          updated_at?: string
          work_date: string
        }
        Update: {
          check_in_at?: string | null
          check_out_at?: string | null
          created_at?: string
          edited_by?: string | null
          employee_id?: string
          id?: string
          late_minutes?: number
          leave_id?: string | null
          notes?: string | null
          overtime_minutes?: number
          source?: Database["public"]["Enums"]["punch_source"]
          status?: Database["public"]["Enums"]["attendance_day_status"]
          updated_at?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_days_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_days_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_days_leave_id_fkey"
            columns: ["leave_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_punches: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          punch_type: Database["public"]["Enums"]["punch_type"]
          punched_at: string
          recorded_by: string | null
          source: Database["public"]["Enums"]["punch_source"]
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          punch_type: Database["public"]["Enums"]["punch_type"]
          punched_at?: string
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["punch_source"]
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          punch_type?: Database["public"]["Enums"]["punch_type"]
          punched_at?: string
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["punch_source"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_punches_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_punches_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_cases: {
        Row: {
          agent_id: string | null
          assigned_staff_id: string | null
          candidate_id: string
          case_code: string
          created_at: string
          deployed_at: string | null
          flight_date: string | null
          flight_number: string | null
          id: string
          job_order_id: string
          mofa_number: string | null
          overall_status: Database["public"]["Enums"]["case_overall_status"]
          processing_office: string | null
          remarks: string | null
          trade_remark: string | null
          updated_at: string
          visa_batch_id: string
        }
        Insert: {
          agent_id?: string | null
          assigned_staff_id?: string | null
          candidate_id: string
          case_code: string
          created_at?: string
          deployed_at?: string | null
          flight_date?: string | null
          flight_number?: string | null
          id?: string
          job_order_id: string
          mofa_number?: string | null
          overall_status?: Database["public"]["Enums"]["case_overall_status"]
          processing_office?: string | null
          remarks?: string | null
          trade_remark?: string | null
          updated_at?: string
          visa_batch_id: string
        }
        Update: {
          agent_id?: string | null
          assigned_staff_id?: string | null
          candidate_id?: string
          case_code?: string
          created_at?: string
          deployed_at?: string | null
          flight_date?: string | null
          flight_number?: string | null
          id?: string
          job_order_id?: string
          mofa_number?: string | null
          overall_status?: Database["public"]["Enums"]["case_overall_status"]
          processing_office?: string | null
          remarks?: string | null
          trade_remark?: string | null
          updated_at?: string
          visa_batch_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_cases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_with_age"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["job_order_id"]
          },
          {
            foreignKeyName: "candidate_cases_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_visa_batch_id_fkey"
            columns: ["visa_batch_id"]
            isOneToOne: false
            referencedRelation: "visa_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          auth_user_id: string | null
          candidate_code: string
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          father_name: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          mother_name: string | null
          nationality: string
          nid_number: string | null
          permanent_address: string | null
          phone: string | null
          photo_path: string | null
          present_address: string | null
          primary_agent_id: string | null
          religion: string | null
          source: Database["public"]["Enums"]["candidate_source"]
          status: Database["public"]["Enums"]["candidate_status"]
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          candidate_code: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          father_name?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          mother_name?: string | null
          nationality?: string
          nid_number?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_path?: string | null
          present_address?: string | null
          primary_agent_id?: string | null
          religion?: string | null
          source?: Database["public"]["Enums"]["candidate_source"]
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          candidate_code?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          father_name?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          mother_name?: string | null
          nationality?: string
          nid_number?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_path?: string | null
          present_address?: string | null
          primary_agent_id?: string | null
          religion?: string | null
          source?: Database["public"]["Enums"]["candidate_source"]
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_primary_agent_id_fkey"
            columns: ["primary_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      case_process_steps: {
        Row: {
          candidate_case_id: string
          completed_at: string | null
          created_at: string
          document_id: string | null
          event_date: string | null
          id: string
          notes: string | null
          reference_no: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["process_step_status"]
          step_code: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          candidate_case_id: string
          completed_at?: string | null
          created_at?: string
          document_id?: string | null
          event_date?: string | null
          id?: string
          notes?: string | null
          reference_no?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["process_step_status"]
          step_code: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          candidate_case_id?: string
          completed_at?: string | null
          created_at?: string
          document_id?: string | null
          event_date?: string | null
          id?: string
          notes?: string | null
          reference_no?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["process_step_status"]
          step_code?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_process_steps_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["candidate_case_id"]
          },
          {
            foreignKeyName: "case_process_steps_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_process_steps_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_process_steps_step_code_fkey"
            columns: ["step_code"]
            isOneToOne: false
            referencedRelation: "process_step_defs"
            referencedColumns: ["code"]
          },
        ]
      }
      company_payments: {
        Row: {
          amount: number
          amount_bdt: number | null
          created_at: string
          currency_code: string
          employer_company_id: string
          id: string
          job_order_id: string | null
          kind: Database["public"]["Enums"]["company_payment_kind"]
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          paid_at: string
          payment_gateway_id: string | null
          proof_document_id: string | null
          recorded_by: string | null
          reference_no: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          amount_bdt?: number | null
          created_at?: string
          currency_code?: string
          employer_company_id: string
          id?: string
          job_order_id?: string | null
          kind?: Database["public"]["Enums"]["company_payment_kind"]
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          paid_at?: string
          payment_gateway_id?: string | null
          proof_document_id?: string | null
          recorded_by?: string | null
          reference_no?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_bdt?: number | null
          created_at?: string
          currency_code?: string
          employer_company_id?: string
          id?: string
          job_order_id?: string | null
          kind?: Database["public"]["Enums"]["company_payment_kind"]
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          paid_at?: string
          payment_gateway_id?: string | null
          proof_document_id?: string | null
          recorded_by?: string | null
          reference_no?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_payments_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "company_payments_employer_company_id_fkey"
            columns: ["employer_company_id"]
            isOneToOne: false
            referencedRelation: "employer_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_payments_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["job_order_id"]
          },
          {
            foreignKeyName: "company_payments_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_payments_payment_gateway_id_fkey"
            columns: ["payment_gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_payments_proof_document_id_fkey"
            columns: ["proof_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          created_at: string
          decimal_places: number
          is_active: boolean
          name: string
          symbol: string
        }
        Insert: {
          code: string
          created_at?: string
          decimal_places?: number
          is_active?: boolean
          name: string
          symbol: string
        }
        Update: {
          code?: string
          created_at?: string
          decimal_places?: number
          is_active?: boolean
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          byte_size: number | null
          checksum_sha256: string | null
          created_at: string
          doc_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          height: number | null
          id: string
          is_optimized: boolean
          is_original: boolean
          mime_type: string | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["document_owner_type"]
          storage_bucket: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          byte_size?: number | null
          checksum_sha256?: string | null
          created_at?: string
          doc_type?: Database["public"]["Enums"]["document_type"]
          file_name: string
          height?: number | null
          id?: string
          is_optimized?: boolean
          is_original?: boolean
          mime_type?: string | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["document_owner_type"]
          storage_bucket: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          byte_size?: number | null
          checksum_sha256?: string | null
          created_at?: string
          doc_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          height?: number | null
          id?: string
          is_optimized?: boolean
          is_original?: boolean
          mime_type?: string | null
          owner_id?: string
          owner_type?: Database["public"]["Enums"]["document_owner_type"]
          storage_bucket?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          avatar_path: string | null
          basic_salary_bdt: number
          created_at: string
          department: string | null
          designation: string | null
          email: string
          employee_code: string
          full_name: string
          id: string
          joining_date: string | null
          nid: string | null
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          basic_salary_bdt?: number
          created_at?: string
          department?: string | null
          designation?: string | null
          email: string
          employee_code: string
          full_name: string
          id: string
          joining_date?: string | null
          nid?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["employee_role"]
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          basic_salary_bdt?: number
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string
          employee_code?: string
          full_name?: string
          id?: string
          joining_date?: string | null
          nid?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
        }
        Relationships: []
      }
      employer_companies: {
        Row: {
          address: string | null
          city: string | null
          company_code: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          country_code: string
          created_at: string
          id: string
          legal_name: string
          license_or_cr_number: string | null
          notes: string | null
          status: Database["public"]["Enums"]["party_status"]
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_code: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country_code: string
          created_at?: string
          id?: string
          legal_name: string
          license_or_cr_number?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["party_status"]
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_code?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country_code?: string
          created_at?: string
          id?: string
          legal_name?: string
          license_or_cr_number?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["party_status"]
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_bdt: number
          candidate_case_id: string | null
          category: string
          created_at: string
          currency: string
          document_id: string | null
          expense_date: string
          id: string
          notes: string | null
          recorded_by: string | null
          updated_at: string
          vendor_name: string | null
          visa_batch_id: string | null
        }
        Insert: {
          amount_bdt: number
          candidate_case_id?: string | null
          category: string
          created_at?: string
          currency?: string
          document_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          updated_at?: string
          vendor_name?: string | null
          visa_batch_id?: string | null
        }
        Update: {
          amount_bdt?: number
          candidate_case_id?: string | null
          category?: string
          created_at?: string
          currency?: string
          document_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          updated_at?: string
          vendor_name?: string | null
          visa_batch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["candidate_case_id"]
          },
          {
            foreignKeyName: "expenses_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_visa_batch_id_fkey"
            columns: ["visa_batch_id"]
            isOneToOne: false
            referencedRelation: "visa_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_schedules: {
        Row: {
          amount_bdt: number
          country_code: string | null
          created_at: string
          currency: string
          fee_code: string
          id: string
          is_active: boolean
          job_category_id: string | null
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount_bdt: number
          country_code?: string | null
          created_at?: string
          currency?: string
          fee_code: string
          id?: string
          is_active?: boolean
          job_category_id?: string | null
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount_bdt?: number
          country_code?: string | null
          created_at?: string
          currency?: string
          fee_code?: string
          id?: string
          is_active?: boolean
          job_category_id?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_schedules_job_category_id_fkey"
            columns: ["job_category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string
          holiday_date: string
          id: string
          is_optional: boolean
          name: string
        }
        Insert: {
          created_at?: string
          holiday_date: string
          id?: string
          is_optional?: boolean
          name: string
        }
        Update: {
          created_at?: string
          holiday_date?: string
          id?: string
          is_optional?: boolean
          name?: string
        }
        Relationships: []
      }
      job_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_orders: {
        Row: {
          contract_duration_months: number | null
          country_code: string
          created_at: string
          created_by: string | null
          demand_letter_document_id: string | null
          employer_company_id: string
          filled_count: number
          id: string
          job_category_id: string
          notes: string | null
          order_code: string
          received_at: string | null
          required_count: number
          salary_amount: number | null
          salary_bdt: number | null
          salary_currency_code: string | null
          salary_offer_text: string | null
          status: Database["public"]["Enums"]["job_order_status"]
          ticket_provision: Database["public"]["Enums"]["ticket_provision"]
          title: string
          updated_at: string
          visa_advice_document_id: string | null
        }
        Insert: {
          contract_duration_months?: number | null
          country_code: string
          created_at?: string
          created_by?: string | null
          demand_letter_document_id?: string | null
          employer_company_id: string
          filled_count?: number
          id?: string
          job_category_id: string
          notes?: string | null
          order_code: string
          received_at?: string | null
          required_count?: number
          salary_amount?: number | null
          salary_bdt?: number | null
          salary_currency_code?: string | null
          salary_offer_text?: string | null
          status?: Database["public"]["Enums"]["job_order_status"]
          ticket_provision?: Database["public"]["Enums"]["ticket_provision"]
          title: string
          updated_at?: string
          visa_advice_document_id?: string | null
        }
        Update: {
          contract_duration_months?: number | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          demand_letter_document_id?: string | null
          employer_company_id?: string
          filled_count?: number
          id?: string
          job_category_id?: string
          notes?: string | null
          order_code?: string
          received_at?: string | null
          required_count?: number
          salary_amount?: number | null
          salary_bdt?: number | null
          salary_currency_code?: string | null
          salary_offer_text?: string | null
          status?: Database["public"]["Enums"]["job_order_status"]
          ticket_provision?: Database["public"]["Enums"]["ticket_provision"]
          title?: string
          updated_at?: string
          visa_advice_document_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_demand_letter_document_id_fkey"
            columns: ["demand_letter_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_employer_company_id_fkey"
            columns: ["employer_company_id"]
            isOneToOne: false
            referencedRelation: "employer_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_job_category_id_fkey"
            columns: ["job_category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_salary_currency_code_fkey"
            columns: ["salary_currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "job_orders_visa_advice_document_id_fkey"
            columns: ["visa_advice_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          days: number
          employee_id: string
          end_date: string
          id: string
          leave_type_id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          days: number
          employee_id: string
          end_date: string
          id?: string
          leave_type_id: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          days?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          annual_allowance_days: number | null
          code: string
          created_at: string
          id: string
          is_active: boolean
          is_paid: boolean
          name: string
        }
        Insert: {
          annual_allowance_days?: number | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name: string
        }
        Update: {
          annual_allowance_days?: number | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name?: string
        }
        Relationships: []
      }
      passports: {
        Row: {
          candidate_id: string
          created_at: string
          date_of_birth: string | null
          emergency_contact_address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          expiry_date: string | null
          father_name: string | null
          full_name_as_in_passport: string | null
          given_names: string | null
          id: string
          is_current: boolean
          issue_date: string | null
          issuing_authority: string | null
          issuing_country: string
          legal_guardian_name: string | null
          mother_name: string | null
          mrz_line1: string | null
          mrz_line2: string | null
          nationality_label: string | null
          notes: string | null
          passport_number: string
          passport_type: string
          permanent_address: string | null
          personal_no: string | null
          place_of_birth: string | null
          place_of_issue: string | null
          previous_passport_no: string | null
          scan_back_path: string | null
          scan_front_path: string | null
          sex: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          expiry_date?: string | null
          father_name?: string | null
          full_name_as_in_passport?: string | null
          given_names?: string | null
          id?: string
          is_current?: boolean
          issue_date?: string | null
          issuing_authority?: string | null
          issuing_country?: string
          legal_guardian_name?: string | null
          mother_name?: string | null
          mrz_line1?: string | null
          mrz_line2?: string | null
          nationality_label?: string | null
          notes?: string | null
          passport_number: string
          passport_type?: string
          permanent_address?: string | null
          personal_no?: string | null
          place_of_birth?: string | null
          place_of_issue?: string | null
          previous_passport_no?: string | null
          scan_back_path?: string | null
          scan_front_path?: string | null
          sex?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          expiry_date?: string | null
          father_name?: string | null
          full_name_as_in_passport?: string | null
          given_names?: string | null
          id?: string
          is_current?: boolean
          issue_date?: string | null
          issuing_authority?: string | null
          issuing_country?: string
          legal_guardian_name?: string | null
          mother_name?: string | null
          mrz_line1?: string | null
          mrz_line2?: string | null
          nationality_label?: string | null
          notes?: string | null
          passport_number?: string
          passport_type?: string
          permanent_address?: string | null
          personal_no?: string | null
          place_of_birth?: string | null
          place_of_issue?: string | null
          previous_passport_no?: string | null
          scan_back_path?: string | null
          scan_front_path?: string | null
          sex?: string | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passports_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passports_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_with_age"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          branch_name: string | null
          code: string
          created_at: string
          id: string
          instructions: string | null
          is_active: boolean
          kind: Database["public"]["Enums"]["gateway_kind"]
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          code: string
          created_at?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          kind?: Database["public"]["Enums"]["gateway_kind"]
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          code?: string
          created_at?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          kind?: Database["public"]["Enums"]["gateway_kind"]
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          amount_bdt: number
          candidate_case_id: string | null
          candidate_id: string | null
          created_at: string
          currency: string
          currency_code: string | null
          direction: Database["public"]["Enums"]["payment_direction"]
          document_id: string | null
          fee_schedule_id: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          payment_gateway_id: string | null
          received_at: string
          recorded_by: string | null
          reference_no: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          amount_bdt: number
          candidate_case_id?: string | null
          candidate_id?: string | null
          created_at?: string
          currency?: string
          currency_code?: string | null
          direction?: Database["public"]["Enums"]["payment_direction"]
          document_id?: string | null
          fee_schedule_id?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_gateway_id?: string | null
          received_at?: string
          recorded_by?: string | null
          reference_no?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          amount_bdt?: number
          candidate_case_id?: string | null
          candidate_id?: string | null
          created_at?: string
          currency?: string
          currency_code?: string | null
          direction?: Database["public"]["Enums"]["payment_direction"]
          document_id?: string | null
          fee_schedule_id?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_gateway_id?: string | null
          received_at?: string
          recorded_by?: string | null
          reference_no?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["candidate_case_id"]
          },
          {
            foreignKeyName: "payments_candidate_case_id_fkey"
            columns: ["candidate_case_id"]
            isOneToOne: false
            referencedRelation: "candidate_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_with_age"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_fee_schedule_id_fkey"
            columns: ["fee_schedule_id"]
            isOneToOne: false
            referencedRelation: "fee_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_gateway_id_fkey"
            columns: ["payment_gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      process_step_defs: {
        Row: {
          code: string
          created_at: string
          description: string | null
          is_active: boolean
          label: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          label: string
          sort_order: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      salary_items: {
        Row: {
          amount_bdt: number
          created_at: string
          id: string
          is_deduction: boolean
          label: string
          salary_month_id: string
        }
        Insert: {
          amount_bdt: number
          created_at?: string
          id?: string
          is_deduction?: boolean
          label: string
          salary_month_id: string
        }
        Update: {
          amount_bdt?: number
          created_at?: string
          id?: string
          is_deduction?: boolean
          label?: string
          salary_month_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_items_salary_month_id_fkey"
            columns: ["salary_month_id"]
            isOneToOne: false
            referencedRelation: "salary_months"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_months: {
        Row: {
          absent_days: number
          allowances_bdt: number
          basic_salary_bdt: number
          created_at: string
          currency: string
          deductions_bdt: number
          employee_id: string
          finalized_at: string | null
          id: string
          late_count: number
          leave_days: number
          month: number
          net_salary_bdt: number
          notes: string | null
          overtime_minutes: number
          paid_at: string | null
          present_days: number
          status: Database["public"]["Enums"]["salary_month_status"]
          updated_at: string
          year: number
        }
        Insert: {
          absent_days?: number
          allowances_bdt?: number
          basic_salary_bdt?: number
          created_at?: string
          currency?: string
          deductions_bdt?: number
          employee_id: string
          finalized_at?: string | null
          id?: string
          late_count?: number
          leave_days?: number
          month: number
          net_salary_bdt?: number
          notes?: string | null
          overtime_minutes?: number
          paid_at?: string | null
          present_days?: number
          status?: Database["public"]["Enums"]["salary_month_status"]
          updated_at?: string
          year: number
        }
        Update: {
          absent_days?: number
          allowances_bdt?: number
          basic_salary_bdt?: number
          created_at?: string
          currency?: string
          deductions_bdt?: number
          employee_id?: string
          finalized_at?: string | null
          id?: string
          late_count?: number
          leave_days?: number
          month?: number
          net_salary_bdt?: number
          notes?: string | null
          overtime_minutes?: number
          paid_at?: string | null
          present_days?: number
          status?: Database["public"]["Enums"]["salary_month_status"]
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "salary_months_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_batches: {
        Row: {
          batch_code: string
          closed_at: string | null
          created_at: string
          filled_count: number
          id: string
          job_order_id: string
          notes: string | null
          opened_at: string | null
          pro_office: string | null
          quota_count: number | null
          status: Database["public"]["Enums"]["visa_batch_status"]
          title: string
          updated_at: string
          visa_id_number: string | null
          visa_number: string | null
        }
        Insert: {
          batch_code: string
          closed_at?: string | null
          created_at?: string
          filled_count?: number
          id?: string
          job_order_id: string
          notes?: string | null
          opened_at?: string | null
          pro_office?: string | null
          quota_count?: number | null
          status?: Database["public"]["Enums"]["visa_batch_status"]
          title: string
          updated_at?: string
          visa_id_number?: string | null
          visa_number?: string | null
        }
        Update: {
          batch_code?: string
          closed_at?: string | null
          created_at?: string
          filled_count?: number
          id?: string
          job_order_id?: string
          notes?: string | null
          opened_at?: string | null
          pro_office?: string | null
          quota_count?: number | null
          status?: Database["public"]["Enums"]["visa_batch_status"]
          title?: string
          updated_at?: string
          visa_id_number?: string | null
          visa_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_batches_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "candidate_case_salary"
            referencedColumns: ["job_order_id"]
          },
          {
            foreignKeyName: "visa_batches_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      candidate_case_salary: {
        Row: {
          candidate_case_id: string | null
          candidate_id: string | null
          filled_count: number | null
          job_order_id: string | null
          remaining_seats: number | null
          required_count: number | null
          salary_amount: number | null
          salary_currency_code: string | null
          salary_currency_name: string | null
          salary_currency_symbol: string | null
          ticket_provision:
            | Database["public"]["Enums"]["ticket_provision"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_cases_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_cases_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates_with_age"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_salary_currency_code_fkey"
            columns: ["salary_currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      candidates_with_age: {
        Row: {
          age_label: string | null
          age_months: number | null
          age_years: number | null
          auth_user_id: string | null
          candidate_code: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          father_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string | null
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          mother_name: string | null
          nationality: string | null
          nid_number: string | null
          permanent_address: string | null
          phone: string | null
          photo_path: string | null
          present_address: string | null
          primary_agent_id: string | null
          religion: string | null
          source: Database["public"]["Enums"]["candidate_source"] | null
          status: Database["public"]["Enums"]["candidate_status"] | null
          updated_at: string | null
        }
        Insert: {
          age_label?: never
          age_months?: never
          age_years?: never
          auth_user_id?: string | null
          candidate_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          mother_name?: string | null
          nationality?: string | null
          nid_number?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_path?: string | null
          present_address?: string | null
          primary_agent_id?: string | null
          religion?: string | null
          source?: Database["public"]["Enums"]["candidate_source"] | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          updated_at?: string | null
        }
        Update: {
          age_label?: never
          age_months?: never
          age_years?: never
          auth_user_id?: string | null
          candidate_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          mother_name?: string | null
          nationality?: string | null
          nid_number?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_path?: string | null
          present_address?: string | null
          primary_agent_id?: string | null
          religion?: string | null
          source?: Database["public"]["Enums"]["candidate_source"] | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_primary_agent_id_fkey"
            columns: ["primary_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      age_label: { Args: { dob: string }; Returns: string }
      age_months_remainder: { Args: { dob: string }; Returns: number }
      age_years: { Args: { dob: string }; Returns: number }
      auth_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_hr_or_admin: { Args: never; Returns: boolean }
      is_internal_user: { Args: never; Returns: boolean }
      is_ops_user: { Args: never; Returns: boolean }
      job_order_remaining: {
        Args: { filled: number; required: number }
        Returns: number
      }
    }
    Enums: {
      attendance_day_status:
        | "present"
        | "absent"
        | "late"
        | "half_day"
        | "weekend"
        | "holiday"
        | "leave"
      candidate_source: "direct" | "agent" | "walk_in" | "referral"
      candidate_status:
        | "lead"
        | "registered"
        | "in_process"
        | "deployed"
        | "returned"
        | "cancelled"
        | "blacklisted"
      case_overall_status:
        | "registered"
        | "processing"
        | "cleared"
        | "ticketed"
        | "deployed"
        | "cancelled"
      commission_status: "pending" | "approved" | "paid" | "cancelled"
      commission_type: "fixed" | "percent" | "per_candidate"
      company_payment_kind:
        | "investment_out"
        | "reimbursement_in"
        | "fee_in"
        | "other"
      document_owner_type:
        | "candidate"
        | "case"
        | "agent"
        | "employer_company"
        | "employee"
        | "job_order"
      document_type:
        | "passport_scan"
        | "nid"
        | "photo"
        | "medical_report"
        | "fit_card"
        | "police_clearance"
        | "visa"
        | "contract"
        | "bmet_card"
        | "ticket"
        | "payment_proof"
        | "other"
        | "demand_letter"
        | "visa_advice"
        | "employer_other"
        | "ticket_go"
        | "ticket_return"
      employee_role: "staff" | "hr" | "office_assistant"
      employee_status: "active" | "inactive" | "terminated"
      gateway_kind: "cash" | "bank" | "bkash" | "nagad" | "card" | "other"
      gender: "male" | "female" | "other"
      job_order_status: "draft" | "open" | "fulfilled" | "closed" | "cancelled"
      leave_request_status: "pending" | "approved" | "rejected" | "cancelled"
      marital_status: "single" | "married" | "divorced" | "widowed"
      party_status: "active" | "inactive"
      payment_direction: "in" | "out"
      payment_method: "cash" | "bkash" | "nagad" | "bank" | "other"
      process_step_status:
        | "pending"
        | "in_progress"
        | "done"
        | "failed"
        | "waived"
        | "not_required"
      punch_source: "manual" | "device" | "app"
      punch_type: "in" | "out"
      salary_month_status: "draft" | "finalized" | "paid"
      ticket_provision: "none" | "go_only" | "return_only" | "go_and_return"
      user_role: "admin" | "staff" | "hr" | "office_assistant" | "candidate"
      visa_batch_status: "open" | "processing" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_day_status: [
        "present",
        "absent",
        "late",
        "half_day",
        "weekend",
        "holiday",
        "leave",
      ],
      candidate_source: ["direct", "agent", "walk_in", "referral"],
      candidate_status: [
        "lead",
        "registered",
        "in_process",
        "deployed",
        "returned",
        "cancelled",
        "blacklisted",
      ],
      case_overall_status: [
        "registered",
        "processing",
        "cleared",
        "ticketed",
        "deployed",
        "cancelled",
      ],
      commission_status: ["pending", "approved", "paid", "cancelled"],
      commission_type: ["fixed", "percent", "per_candidate"],
      company_payment_kind: [
        "investment_out",
        "reimbursement_in",
        "fee_in",
        "other",
      ],
      document_owner_type: [
        "candidate",
        "case",
        "agent",
        "employer_company",
        "employee",
        "job_order",
      ],
      document_type: [
        "passport_scan",
        "nid",
        "photo",
        "medical_report",
        "fit_card",
        "police_clearance",
        "visa",
        "contract",
        "bmet_card",
        "ticket",
        "payment_proof",
        "other",
        "demand_letter",
        "visa_advice",
        "employer_other",
        "ticket_go",
        "ticket_return",
      ],
      employee_role: ["staff", "hr", "office_assistant"],
      employee_status: ["active", "inactive", "terminated"],
      gateway_kind: ["cash", "bank", "bkash", "nagad", "card", "other"],
      gender: ["male", "female", "other"],
      job_order_status: ["draft", "open", "fulfilled", "closed", "cancelled"],
      leave_request_status: ["pending", "approved", "rejected", "cancelled"],
      marital_status: ["single", "married", "divorced", "widowed"],
      party_status: ["active", "inactive"],
      payment_direction: ["in", "out"],
      payment_method: ["cash", "bkash", "nagad", "bank", "other"],
      process_step_status: [
        "pending",
        "in_progress",
        "done",
        "failed",
        "waived",
        "not_required",
      ],
      punch_source: ["manual", "device", "app"],
      punch_type: ["in", "out"],
      salary_month_status: ["draft", "finalized", "paid"],
      ticket_provision: ["none", "go_only", "return_only", "go_and_return"],
      user_role: ["admin", "staff", "hr", "office_assistant", "candidate"],
      visa_batch_status: ["open", "processing", "completed", "cancelled"],
    },
  },
} as const

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
      admin_profiles: {
        Row: {
          created_at: string
          department: string
          id: string
          permissions: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string
          id?: string
          permissions?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          permissions?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          id: string
          ip_address: string | null
          resource: string
          resource_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          resource: string
          resource_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          resource?: string
          resource_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string
          description: string
          doctor_id: string
          episode_id: string | null
          id: string
          lawyer_id: string | null
          notes: string | null
          patient_id: string | null
          priority: Database["public"]["Enums"]["case_priority"]
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          doctor_id: string
          episode_id?: string | null
          id?: string
          lawyer_id?: string | null
          notes?: string | null
          patient_id?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          doctor_id?: string
          episode_id?: string | null
          id?: string
          lawyer_id?: string | null
          notes?: string | null
          patient_id?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "clinical_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_episodes: {
        Row: {
          created_at: string
          description: string
          diagnosis: string | null
          doctor_id: string
          end_date: string | null
          id: string
          is_active: boolean
          patient_id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          diagnosis?: string | null
          doctor_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          patient_id: string
          start_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          diagnosis?: string | null
          doctor_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          patient_id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_episodes_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_episodes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          case_title: string | null
          created_at: string
          from_doctor_id: string
          id: string
          message: string
          ml_score: number | null
          response_message: string | null
          status: Database["public"]["Enums"]["contact_request_status"]
          to_lawyer_id: string
          updated_at: string
        }
        Insert: {
          case_title?: string | null
          created_at?: string
          from_doctor_id: string
          id?: string
          message: string
          ml_score?: number | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["contact_request_status"]
          to_lawyer_id: string
          updated_at?: string
        }
        Update: {
          case_title?: string | null
          created_at?: string
          from_doctor_id?: string
          id?: string
          message?: string
          ml_score?: number | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["contact_request_status"]
          to_lawyer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_from_doctor_id_fkey"
            columns: ["from_doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_to_lawyer_id_fkey"
            columns: ["to_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          bio: string | null
          cmp: string
          created_at: string
          embedding: string | null
          hospital: string
          hospital_id: string | null
          id: string
          languages: string[]
          phone: string
          specialty: string
          sub_specialties: string[]
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          bio?: string | null
          cmp: string
          created_at?: string
          embedding?: string | null
          hospital: string
          hospital_id?: string | null
          id?: string
          languages?: string[]
          phone?: string
          specialty: string
          sub_specialties?: string[]
          updated_at?: string
          user_id: string
          years_experience?: number
        }
        Update: {
          bio?: string | null
          cmp?: string
          created_at?: string
          embedding?: string | null
          hospital?: string
          hospital_id?: string | null
          id?: string
          languages?: string[]
          phone?: string
          specialty?: string
          sub_specialties?: string[]
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          document_id: string
          hash: string | null
          id: string
          is_valid: boolean
          signed_at: string
          signer_id: string
          type: Database["public"]["Enums"]["signature_type"]
        }
        Insert: {
          document_id: string
          hash?: string | null
          id?: string
          is_valid?: boolean
          signed_at?: string
          signer_id: string
          type: Database["public"]["Enums"]["signature_type"]
        }
        Update: {
          document_id?: string
          hash?: string | null
          id?: string
          is_valid?: boolean
          signed_at?: string
          signer_id?: string
          type?: Database["public"]["Enums"]["signature_type"]
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_signatures_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          content: string
          created_at: string
          created_by: string
          document_id: string
          file_url: string | null
          id: string
          notes: string | null
          version: number
        }
        Insert: {
          content?: string
          created_at?: string
          created_by: string
          document_id: string
          file_url?: string | null
          id?: string
          notes?: string | null
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          document_id?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          author_id: string
          case_id: string | null
          created_at: string
          current_version_id: string | null
          episode_id: string | null
          id: string
          patient_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
        }
        Insert: {
          author_id: string
          case_id?: string | null
          created_at?: string
          current_version_id?: string | null
          episode_id?: string | null
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          case_id?: string | null
          created_at?: string
          current_version_id?: string | null
          episode_id?: string | null
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "clinical_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          city: string
          created_at: string
          department: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          city?: string
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      lawyer_profiles: {
        Row: {
          bio: string | null
          cab: string
          created_at: string
          embedding: string | null
          id: string
          medical_areas: string[]
          phone: string
          rating: number
          resolved_cases: number
          specialties: string[]
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          bio?: string | null
          cab: string
          created_at?: string
          embedding?: string | null
          id?: string
          medical_areas?: string[]
          phone?: string
          rating?: number
          resolved_cases?: number
          specialties?: string[]
          updated_at?: string
          user_id: string
          years_experience?: number
        }
        Update: {
          bio?: string | null
          cab?: string
          created_at?: string
          embedding?: string | null
          id?: string
          medical_areas?: string[]
          phone?: string
          rating?: number
          resolved_cases?: number
          specialties?: string[]
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "lawyer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_recommendations: {
        Row: {
          algorithm_version: string
          created_at: string
          doctor_id: string
          feedback_at: string | null
          id: string
          is_accepted: boolean | null
          lawyer_id: string
          reasons: string[]
          score: number
        }
        Insert: {
          algorithm_version?: string
          created_at?: string
          doctor_id: string
          feedback_at?: string | null
          id?: string
          is_accepted?: boolean | null
          lawyer_id: string
          reasons?: string[]
          score: number
        }
        Update: {
          algorithm_version?: string
          created_at?: string
          doctor_id?: string
          feedback_at?: string | null
          id?: string
          is_accepted?: boolean | null
          lawyer_id?: string
          reasons?: string[]
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_recommendations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_recommendations_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string
          blood_type: string | null
          created_at: string
          created_by: string | null
          dni: string
          email: string | null
          gender: Database["public"]["Enums"]["patient_gender"]
          id: string
          last_name: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          blood_type?: string | null
          created_at?: string
          created_by?: string | null
          dni: string
          email?: string | null
          gender: Database["public"]["Enums"]["patient_gender"]
          id?: string
          last_name: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          blood_type?: string | null
          created_at?: string
          created_by?: string | null
          dni?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["patient_gender"]
          id?: string
          last_name?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      case_priority: "baja" | "media" | "alta" | "critica"
      case_status: "nuevo" | "en_revision" | "activo" | "cerrado" | "archivado"
      contact_request_status:
        | "pendiente"
        | "aceptado"
        | "rechazado"
        | "cancelado"
      document_status: "borrador" | "pendiente_firma" | "firmado" | "archivado"
      document_type:
        | "historia_clinica"
        | "consentimiento_informado"
        | "informe_medico"
        | "receta"
        | "orden_laboratorio"
        | "certificado_medico"
        | "documento_legal"
        | "otro"
      patient_gender: "M" | "F" | "other"
      signature_type: "digital" | "huella" | "firma_manuscrita"
      user_role: "doctor" | "lawyer" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      case_priority: ["baja", "media", "alta", "critica"],
      case_status: ["nuevo", "en_revision", "activo", "cerrado", "archivado"],
      contact_request_status: [
        "pendiente",
        "aceptado",
        "rechazado",
        "cancelado",
      ],
      document_status: ["borrador", "pendiente_firma", "firmado", "archivado"],
      document_type: [
        "historia_clinica",
        "consentimiento_informado",
        "informe_medico",
        "receta",
        "orden_laboratorio",
        "certificado_medico",
        "documento_legal",
        "otro",
      ],
      patient_gender: ["M", "F", "other"],
      signature_type: ["digital", "huella", "firma_manuscrita"],
      user_role: ["doctor", "lawyer", "admin"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          plan: 'free' | 'plus'
          usage_count: number
          usage_reset_date: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          plan?: 'free' | 'plus'
          usage_count?: number
          usage_reset_date?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          plan?: 'free' | 'plus'
          usage_count?: number
          usage_reset_date?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          audio_url: string | null
          file_name: string | null
          file_size: number | null
          transcript: string | null
          summary: string | null
          generated_post: string | null
          style: 'Facebook' | 'IG' | 'Twitter' | null
          processing_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          audio_url?: string | null
          file_name?: string | null
          file_size?: number | null
          transcript?: string | null
          summary?: string | null
          generated_post?: string | null
          style?: 'Facebook' | 'IG' | 'Twitter' | null
          processing_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          audio_url?: string | null
          file_name?: string | null
          file_size?: number | null
          transcript?: string | null
          summary?: string | null
          generated_post?: string | null
          style?: 'Facebook' | 'IG' | 'Twitter' | null
          processing_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: 'transcribe' | 'generate_post'
          file_size: number | null
          processing_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: 'transcribe' | 'generate_post'
          file_size?: number | null
          processing_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: 'transcribe' | 'generate_post'
          file_size?: number | null
          processing_time?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      increment_usage: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      reset_daily_usage: {
        Args: {}
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

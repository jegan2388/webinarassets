import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  is_pro_user: boolean
  webinars_processed_count: number
  created_at: string
  updated_at: string
}

export interface WebinarRequest {
  id: string
  user_id: string
  stripe_session_id: string | null
  payment_status: 'pending' | 'completed' | 'failed'
  form_data: any
  amount_paid: number
  created_at: string
  updated_at: string
  processed_at: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      webinar_requests: {
        Row: WebinarRequest
        Insert: Omit<WebinarRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WebinarRequest, 'id' | 'created_at'>>
      }
    }
  }
}
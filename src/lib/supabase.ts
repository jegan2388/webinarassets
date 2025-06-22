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
  subscription_status: 'free' | 'pro' | 'canceled' | 'past_due'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  current_plan_id?: string
  monthly_content_limit: number
  content_processed_this_month: number
  subscription_ends_at?: string
  last_billed_at?: string
}

export interface ContentRequest {
  id: string
  user_id: string
  stripe_session_id: string | null
  payment_status: 'pending' | 'completed' | 'failed'
  form_data: any
  amount_paid: number
  created_at: string
  updated_at: string
  processed_at: string | null
  subscription_tier: 'free' | 'pro'
  content_type: 'file' | 'link' | 'text'
  assets_json?: any
  transcript?: string
  brand_data?: any
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
        Row: ContentRequest
        Insert: Omit<ContentRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContentRequest, 'id' | 'created_at'>>
      }
    }
  }
}
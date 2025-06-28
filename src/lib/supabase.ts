import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Declare the supabase variable that will be exported
let supabase: any

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url' || 
    supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase not configured. Please click "Connect to Supabase" in the top right to set up your database.')
  
  // Create a mock client to prevent initialization errors
  supabase = {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured')),
      insert: () => Promise.reject(new Error('Supabase not configured')),
      update: () => Promise.reject(new Error('Supabase not configured')),
      delete: () => Promise.reject(new Error('Supabase not configured'))
    })
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Export the supabase client
export { supabase }

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
  delivery_email?: string
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
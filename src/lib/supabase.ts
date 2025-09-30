import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key'

// Create client with fallback values to prevent crashes
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  credits: number
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'earned' | 'spent' | 'purchased' | 'bonus'
  description: string
  module?: string
  created_at: string
}

export type ChatAgent = 'Vira' | 'Bizzy' | 'Artie' | 'Mak' | 'General'

export interface ChatMessage {
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

export interface Chat {
  id: string
  user_id: string
  agent: ChatAgent
  title: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

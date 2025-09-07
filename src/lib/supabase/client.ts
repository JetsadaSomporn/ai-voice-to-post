import { createBrowserClient } from '@supabase/ssr'

// Singleton pattern to prevent memory leaks
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  // Create and store singleton instance
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  
  return supabaseInstance
}

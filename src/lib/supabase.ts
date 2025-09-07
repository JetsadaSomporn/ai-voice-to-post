import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

// Environment variables validation (only for server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only validate on server-side (for SSR/SSG)
if (typeof window === 'undefined') {
  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
}

// Browser-safe supabase client factory
export const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient<Database>(url, key)
}

// Server-side clients (only create if we have the keys)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseAdmin = supabaseServiceKey && supabaseUrl
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null

// Client-side hook (uses auth-helpers)
export const useSupabase = () => createClientComponentClient<Database>()

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string) => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        },
      })

      if (error) {
        console.error('SignUp error:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('SignUp exception:', err)
      return { 
        data: null, 
        error: { message: 'Failed to sign up', original: err }
      }
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('SignIn error:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('SignIn exception:', err)
      return { 
        data: null, 
        error: { message: 'Failed to sign in', original: err }
      }
    }
  },

  signInWithGoogle: async () => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('Google OAuth exception:', err)
      return { 
        data: null, 
        error: { message: 'Failed to sign in with Google', original: err }
      }
    }
  },

  signOut: async () => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('SignOut error:', error)
      }

      return { error }
    } catch (err) {
      console.error('SignOut exception:', err)
      return { 
        error: { message: 'Failed to sign out', original: err }
      }
    }
  },

  getUser: async () => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error('GetUser error:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('GetUser exception:', err)
      return { 
        data: null, 
        error: { message: 'Failed to get user', original: err }
      }
    }
  },

  getSession: async () => {
    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('GetSession error:', error)
      }

      return { data, error }
    } catch (err) {
      console.error('GetSession exception:', err)
      return { 
        data: null, 
        error: { message: 'Failed to get session', original: err }
      }
    }
  },
}

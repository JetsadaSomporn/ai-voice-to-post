'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        if (error) {
          console.error('❌ AuthContext: Error getting session:', error)
          setSession(null)
          setUser(null)
        } else {
          console.log('✅ AuthContext: Initial session:', !!session, session?.user?.email)
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('❌ AuthContext: Session fetch error:', error)
        setSession(null)
        setUser(null)
      } finally {
        if (isMounted) {
          console.log('✅ AuthContext: Initial loading complete')
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        if (!isMounted) return
        
        console.log('🔄 AuthContext: Auth state change:', event, !!session, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Ensure loading is false after auth state change
        if (isMounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      // State will be updated by onAuthStateChange
    } catch (error) {
      console.error('Logout exception:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

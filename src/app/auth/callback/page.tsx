'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleCallback = async () => {
      try {
        console.log('🔗 Processing OAuth callback...')
        
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const error_description = searchParams.get('error_description')

        // Check for OAuth errors
        if (error) {
          throw new Error(error_description || error)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        console.log('🔗 Exchanging code for session...')
        
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('❌ Code exchange error:', exchangeError)
          throw exchangeError
        }

        if (data.session && data.user) {
          console.log('✅ OAuth login successful:', data.user.email)
          setStatus('success')
          setMessage(`Welcome back, ${data.user.email}! Redirecting...`)
          
          // Clear timeout and redirect
          if (timeoutId) clearTimeout(timeoutId)
          
          setTimeout(() => {
            router.push('/record')
          }, 1500)
          
        } else {
          throw new Error('No session created after code exchange')
        }

      } catch (error: any) {
        console.error('❌ OAuth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Authentication failed')
        
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    // Set timeout fallback (15 seconds)
    timeoutId = setTimeout(() => {
      console.log('⏰ OAuth callback timeout')
      setStatus('error')
      setMessage('Authentication timed out. Please try again.')
    }, 15000)

    handleCallback()

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Signing You In</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">This should only take a moment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h1 className="text-2xl font-semibold text-green-700 mb-3">Welcome Back!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="w-full bg-green-200 rounded-full h-2 mb-4">
              <div className="bg-green-600 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">✗</span>
            </div>
            <h1 className="text-2xl font-semibold text-red-700 mb-3">Sign In Failed</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/record')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EmailConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your email...')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') || '/record'
        
        console.log('📧 Email confirmation attempt:', { 
          hasToken: !!token_hash, 
          type, 
          next 
        })

        if (!token_hash || !type) {
          throw new Error('Invalid confirmation link. Missing required parameters.')
        }

        // Verify email confirmation
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })

        if (error) {
          console.error('❌ Email confirmation error:', error)
          throw error
        }

        if (data.user) {
          console.log('✅ Email confirmed successfully:', data.user.email)
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to your account...')
          
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push(next)
          }, 2000)
        } else {
          throw new Error('Email confirmation failed. No user data received.')
        }

      } catch (error: any) {
        console.error('❌ Email confirmation failed:', error)
        setStatus('error')
        setMessage(error.message || 'Email confirmation failed')
      }
    }

    confirmEmail()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Confirming Email</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h1 className="text-2xl font-semibold text-green-700 mb-3">Email Confirmed!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="w-full bg-green-200 rounded-full h-2 mb-4">
              <div className="bg-green-600 h-2 rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">✗</span>
            </div>
            <h1 className="text-2xl font-semibold text-red-700 mb-3">Confirmation Failed</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, please contact support.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

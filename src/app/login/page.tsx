'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const router = useRouter()
  const supabase = createClient()

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }

        console.log('📝 Registering user:', email)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error

        if (data.user && !data.session) {
          showMessage(
            '✅ Registration successful! Please check your email and click the confirmation link to activate your account.',
            'success'
          )
          console.log('📧 Email confirmation sent to:', email)
        } else if (data.session) {
          showMessage('✅ Account created and logged in successfully!', 'success')
          router.push('/record')
        }
      } else {
        console.log('🔐 Signing in user:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error

        if (data.session) {
          showMessage('✅ Login successful!', 'success')
          router.push('/record')
        }
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error)
      showMessage(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    
    try {
      console.log('🔗 Starting Google OAuth...')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        }
      })
      
      if (error) throw error
      
      console.log('🔗 Redirecting to Google...')
    } catch (error: any) {
      console.error('❌ Google OAuth error:', error)
      showMessage(`Google ${mode} failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Welcome back to Voice2Post' 
                : 'Join Voice2Post today'
              }
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <span>G</span>
            Continue with Google
          </button>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-gray-900 font-medium hover:underline"
                disabled={loading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-32 h-32 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl text-white">🎤</span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Transform Voice to Posts
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Record your voice, let AI generate engaging social media content in seconds. 
            Perfect for content creators, marketers, and busy professionals.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">1</span>
              </div>
              <span className="text-gray-700">Record your voice</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <span className="text-gray-700">AI generates content</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">3</span>
              </div>
              <span className="text-gray-700">Share to social media</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

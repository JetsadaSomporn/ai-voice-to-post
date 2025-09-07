'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { stripePromise, STRIPE_PRICE_ID, PLANS } from '@/lib/stripe'

export default function UpgradePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const { user, session, loading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (authLoading) return // Wait for auth to load
    
    if (!user || !session) {
      router.push('/login')
      return
    }

    // Get user profile
    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
    }
    
    fetchProfile()

    // Check for success/cancel params
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success) {
      alert('🎉 การชำระเงินสำเร็จ! ยินดีต้อนรับสู่ Plus Plan')
      router.replace('/upgrade')
    } else if (canceled) {
      alert('การชำระเงินถูกยกเลิก')
      router.replace('/upgrade')
    }
  }, [user, session, authLoading, router, supabase, searchParams])

  const handleUpgrade = async (priceId: string) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        alert('เกิดข้อผิดพลาด: ' + error)
        return
      }

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          alert('เกิดข้อผิดพลาด: ' + error.message)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url, error } = await response.json()

      if (error) {
        alert('เกิดข้อผิดพลาด: ' + error)
        return
      }

      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!user || !session) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to manage your subscription.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">★</span>
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Upgrade to <span className="text-yellow-500">Plus</span>
        </h1>
        <p className="text-xl text-gray-600">
          Unlock premium features and unlimited usage
        </p>
      </div>

      {/* Show current plan status */}
      {profile && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <p className="text-gray-800">
            <span className="font-medium">Current plan:</span> {profile.plan === 'plus' ? 'Plus ⭐' : 'Free'}
          </p>
          {profile.plan === 'plus' ? (
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <p className="text-gray-600 text-sm">
                You're already using Plus Plan. Enjoy unlimited features! 🎉
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <span className="text-sm">💳</span>
                    Manage Subscription
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 text-sm mt-1">
              Upgrade to Plus for unlimited usage! 🚀
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Free Plan */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 relative">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-900">
              Free
              <span className="text-lg font-normal text-gray-600">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>3 uses per day</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Basic post styles</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">×</span>
              </div>
              <span>No history saved</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">×</span>
              </div>
              <span>No premium styles</span>
            </li>
          </ul>

          <div className="text-center">
            <div className="bg-gray-100 text-gray-600 py-3 rounded-lg font-medium">
              Current Plan
            </div>
          </div>
        </div>

        {/* Plus Plan */}
        <div className="bg-gray-900 text-white rounded-lg p-8 relative transform scale-105">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              🔥 Recommended
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2">Plus</h3>
            <div className="text-3xl font-bold">
              $9
              <span className="text-lg font-normal opacity-90">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span>Unlimited usage</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⭐</span>
              </div>
              <span>Multiple post styles</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Save history</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👑</span>
              </div>
              <span>Export PDF</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span>Faster processing</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⭐</span>
              </div>
              <span>Priority support</span>
            </li>
          </ul>

          <div className="text-center">
            {profile?.plan === 'plus' ? (
              <div className="space-y-3">
                <div className="bg-white/20 text-white py-3 rounded-lg font-bold">
                  ✅ Active
                </div>
                <button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 text-white py-2 rounded-lg font-medium hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span className="text-sm">💳</span>
                      Manage
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade(STRIPE_PRICE_ID.PLUS_MONTHLY)}
                disabled={loading}
                className="w-full bg-white text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="text-sm">💳</span>
                    Upgrade Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-900">Feature</th>
                <th className="text-center py-4 px-6">Free</th>
                <th className="text-center py-4 px-6 bg-gray-50">Plus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Daily usage</td>
                <td className="py-4 px-6 text-center">3 times</td>
                <td className="py-4 px-6 text-center bg-gray-50">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Audio file length</td>
                <td className="py-4 px-6 text-center">5 minutes</td>
                <td className="py-4 px-6 text-center bg-gray-50">30 minutes</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Post styles</td>
                <td className="py-4 px-6 text-center">3 styles</td>
                <td className="py-4 px-6 text-center bg-gray-50">10+ styles</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Save history</td>
                <td className="py-4 px-6 text-center">❌</td>
                <td className="py-4 px-6 text-center bg-gray-50">✅</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Export PDF</td>
                <td className="py-4 px-6 text-center">❌</td>
                <td className="py-4 px-6 text-center bg-gray-50">✅</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-gray-900">Support</td>
                <td className="py-4 px-6 text-center">Email</td>
                <td className="py-4 px-6 text-center bg-gray-50">Email + Chat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 text-gray-900">💳 Payment methods</h3>
            <p className="text-gray-600">We accept credit/debit cards, PayPal, and bank transfers</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-gray-900">🔄 Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel anytime with no commitment</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-gray-900">📱 Mobile compatibility?</h3>
            <p className="text-gray-600">Works on both desktop and mobile devices</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-gray-900">🔒 Is my data secure?</h3>
            <p className="text-gray-600">All data is encrypted and audio files are deleted after processing</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/record')}
          className="text-gray-600 hover:text-gray-800 underline transition-colors"
        >
          ← Back to recording
        </button>
      </div>
    </div>
  )
}

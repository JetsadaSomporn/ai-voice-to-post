'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function PlanPage() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Voice2Post</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <button
                    onClick={() => router.push('/record')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Go to App
                  </button>
                  <button
                    onClick={async () => {
                      await signOut()
                      router.push('/login')
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your voice into engaging social media content with AI-powered generation
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                5 voice recordings per day
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Basic AI content generation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Standard templates
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Email support
              </li>
            </ul>

            <button
              onClick={() => {
                if (user) {
                  router.push('/record')
                } else {
                  router.push('/login')
                }
              }}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {user ? 'Current Plan' : 'Get Started Free'}
            </button>
          </div>

          {/* Plus Plan */}
          <div className="border-2 border-gray-900 rounded-xl p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Plus</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $9<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">For content creators</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Unlimited voice recordings
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Advanced AI with multiple styles
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Premium templates & customization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Multi-platform optimization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Analytics & insights
              </li>
            </ul>

            <button
              onClick={() => {
                if (user) {
                  // Redirect to payment/upgrade flow
                  alert('Upgrade feature coming soon!')
                } else {
                  router.push('/login')
                }
              }}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {user ? 'Upgrade to Plus' : 'Start Plus Trial'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does voice-to-post generation work?
              </h3>
              <p className="text-gray-600">
                Simply record your voice or upload an audio file. Our AI will transcribe your speech and generate engaging social media content optimized for different platforms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What languages are supported?
              </h3>
              <p className="text-gray-600">
                Currently we support English and Thai, with more languages coming soon.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your Plus subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for Plus?
              </h3>
              <p className="text-gray-600">
                Yes, new users get a 7-day free trial of Plus features when they sign up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

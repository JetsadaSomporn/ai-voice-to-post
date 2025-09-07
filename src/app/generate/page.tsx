'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export default function GeneratePage() {
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [generatedPost, setGeneratedPost] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<'Facebook' | 'IG' | 'Twitter'>('Facebook')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState<'transcribing' | 'generating' | 'completed' | 'error'>('transcribing')
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, session, loading: authLoading } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    console.log('🎯 Generate Page: Auth state check', {
      authLoading,
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email
    })
    
    if (authLoading) return // Wait for auth to load
    
    if (!user || !session) {
      console.log('❌ Generate Page: No auth, redirecting to login')
      router.push('/login')
      return
    }
    
    console.log('✅ Generate Page: Auth OK, ready to process')
  }, [user, session, authLoading, router])

  useEffect(() => {
    const audioUrl = searchParams.get('audio_url')
    if (audioUrl && user) {
      processAudio(audioUrl)
    }
  }, [searchParams, user])

  const processAudio = async (audioUrl: string) => {
    try {
      setIsTranscribing(true)
      setStep('transcribing')

      console.log('🎵 Processing audio URL:', audioUrl)

      // Send audio URL directly to transcribe API
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioUrl: audioUrl
        })
      })

      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json()
        throw new Error(errorData.error || 'Failed to transcribe audio')
      }

      const transcribeData = await transcribeResponse.json()
      setTranscript(transcribeData.transcript)
      setIsTranscribing(false)

      // Generate post
      await generatePost(transcribeData.transcript, selectedStyle)

    } catch (error: any) {
      console.error('Error processing audio:', error)
      setError('เกิดข้อผิดพลาดในการประมวลผลเสียง: ' + error.message)
      setStep('error')
      setIsTranscribing(false)
      setIsGenerating(false)
    }
  }

  const generatePost = async (text: string, style: 'Facebook' | 'IG' | 'Twitter') => {
    try {
      setIsGenerating(true)
      setStep('generating')

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: text,
          style
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()
      setSummary(data.summary)
      setGeneratedPost(data.post)
      setStep('completed')

      // Save to database if user has Plus plan
      await saveRecord(text, data.summary, data.post, style)

    } catch (error: any) {
      console.error('Error generating post:', error)
      setError('เกิดข้อผิดพลาดในการสร้างโพสต์: ' + error.message)
      setStep('error')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveRecord = async (transcript: string, summary: string, post: string, style: string) => {
    if (!user) return // Guard clause
    
    try {
      // Get user profile to check plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      // Only save if user has Plus plan
      if (profile?.plan === 'plus') {
        await supabase
          .from('records')
          .insert({
            user_id: user.id,
            transcript,
            summary,
            generated_post: post,
            style,
            audio_url: searchParams.get('audio_url')
          })
      }
    } catch (error) {
      console.error('Error saving record:', error)
      // Don't show error to user as this is not critical
    }
  }

  const regeneratePost = () => {
    if (transcript) {
      generatePost(transcript, selectedStyle)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('คัดลอกแล้ว!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('คัดลอกแล้ว!')
    }
  }

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'โพสต์จาก Voice2Post',
          text: generatedPost
        })
      } catch (error) {
        copyToClipboard(generatedPost)
      }
    } else {
      copyToClipboard(generatedPost)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to use the generation feature.</p>
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
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">AI Processing</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${
            step === 'transcribing' ? 'text-gray-900' : 
            step === 'generating' || step === 'completed' ? 'text-gray-700' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'transcribing' ? 'bg-gray-900 text-white' :
              step === 'generating' || step === 'completed' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {isTranscribing ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : '1'}
            </div>
            <span>Transcribe</span>
          </div>
          
          <div className={`w-8 h-1 ${
            step === 'generating' || step === 'completed' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          
          <div className={`flex items-center space-x-2 ${
            step === 'generating' ? 'text-gray-900' : 
            step === 'completed' ? 'text-gray-700' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'generating' ? 'bg-gray-900 text-white' :
              step === 'completed' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {isGenerating ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : '2'}
            </div>
            <span>Generate</span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {step === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/record')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading States */}
      {isTranscribing && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="font-medium text-gray-900">Transcribing audio to text</h3>
              <p className="text-gray-600">Please wait a moment...</p>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="font-medium text-gray-900">Generating post</h3>
              <p className="text-gray-600">AI is writing your post...</p>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Result */}
      {transcript && !isTranscribing && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-5 h-5 flex items-center justify-center bg-gray-900 text-white rounded text-sm">T</span>
            Transcribed Text
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 leading-relaxed">{transcript}</p>
          </div>
          <button
            onClick={() => copyToClipboard(transcript)}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span className="text-sm">📋</span>
            Copy text
          </button>
        </div>
      )}

      {/* Style Selection */}
      {transcript && !isGenerating && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-medium mb-4 text-gray-900">Select Post Style</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['Facebook', 'IG', 'Twitter'].map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style as any)}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  selectedStyle === style
                    ? 'border-gray-900 bg-gray-50 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{style}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {style === 'Facebook' && 'Long post with emojis'}
                  {style === 'IG' && 'Caption + hashtags'}
                  {style === 'Twitter' && 'Short, 280 characters'}
                </div>
              </button>
            ))}
          </div>
          {step === 'completed' && (
            <button
              onClick={regeneratePost}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm">↻</span>
              Regenerate
            </button>
          )}
        </div>
      )}

      {/* Generated Post Result */}
      {generatedPost && step === 'completed' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-900">
            <span className="w-5 h-5 flex items-center justify-center bg-gray-900 text-white rounded text-sm">AI</span>
            Generated Post ({selectedStyle})
          </h3>
          
          {summary && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
              <p className="text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">{summary}</p>
            </div>
          )}
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {generatedPost}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => copyToClipboard(generatedPost)}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm">📋</span>
              Copy Post
            </button>
            
            <button
              onClick={sharePost}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm">📤</span>
              Share
            </button>
            
            <button
              onClick={() => router.push('/record')}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Create New
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

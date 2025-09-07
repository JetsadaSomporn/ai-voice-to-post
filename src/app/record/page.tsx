'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    
    const getUser = async () => {
      try {
        console.log('🔍 Checking authentication...')
        
        // Add timeout for auth check
        const authPromise = supabase.auth.getUser()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Authentication timeout')), 10000)
        )
        
        const result = await Promise.race([authPromise, timeoutPromise]) as any
        const { data: { user }, error } = result
        
        if (!isMounted) return
        
        if (error) {
          console.error('❌ Auth error:', error)
          setAuthError('Authentication failed. Please try logging in again.')
          setIsLoading(false)
          return
        }
        
        if (!user) {
          console.log('🔐 No user found, redirecting to login...')
          router.push('/login')
          return
        }
        
        console.log('✅ User authenticated:', user.email)
        setUser(user)
        setIsLoading(false)
        
      } catch (error: any) {
        console.error('❌ Auth check error:', error)
        if (isMounted) {
          if (error.message === 'Authentication timeout') {
            setAuthError('Authentication timed out. Please refresh the page.')
          } else {
            setAuthError('Failed to verify authentication. Please try logging in again.')
          }
          setIsLoading(false)
        }
      }
    }
    
    // Set overall timeout
    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log('⏰ Page load timeout')
        setAuthError('Page load timed out. Please refresh the page.')
        setIsLoading(false)
      }
    }, 15000)
    
    getUser()
    
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [router, supabase, isLoading])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Create file for upload
        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' })
        setAudioFile(file)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตการใช้งานไมโครโฟน')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('audio/')) {
        alert('กรุณาเลือกไฟล์เสียงเท่านั้น')
        return
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('ไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB')
        return
      }

      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const clearAudio = () => {
    setAudioUrl(null)
    setAudioFile(null)
    setIsPlaying(false)
    setRecordingTime(0)
  }

  const processAudio = async () => {
    if (!audioFile || !user) return

    setIsProcessing(true)
    try {
      // Upload audio file
      const fileName = `${user.id}/${Date.now()}-${audioFile.name}`
      
      console.log('📤 Uploading audio file:', {
        fileName,
        originalName: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioFile)

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw uploadError
      }

      console.log('✅ Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName)

      console.log('🔗 Public URL:', publicUrl)

      // Test if URL is accessible
      try {
        const testResponse = await fetch(publicUrl, { method: 'HEAD' })
        console.log('🧪 URL test:', {
          status: testResponse.status,
          contentType: testResponse.headers.get('content-type'),
          contentLength: testResponse.headers.get('content-length')
        })
      } catch (testError) {
        console.warn('⚠️ URL test failed:', testError)
      }

      // Redirect to generate page with audio URL
      router.push(`/generate?audio_url=${encodeURIComponent(publicUrl)}`)

    } catch (error) {
      console.error('Error processing audio:', error)
      alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์เสียง กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl text-white">✗</span>
          </div>
          <h2 className="text-2xl font-semibold text-red-700">Authentication Error</h2>
          <p className="text-gray-600">{authError}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Old loading check (fallback)
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-900">กำลังโหลด...</h2>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">Voice Recording</h1>
        
        {/* Recording Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-lg font-medium transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {isRecording ? 'Stop' : 'Record'}
            </button>
          </div>
          
          {isRecording && (
            <div className="text-red-500 font-mono text-xl mb-4">
              Recording {formatTime(recordingTime)}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {isRecording ? 'Click to stop recording' : 'Click to start recording'}
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="text-center mb-8">
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 border-2 border-gray-300 rounded mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">↑</span>
              </div>
              <p className="text-gray-600 mb-2">Upload audio file</p>
              <p className="text-sm text-gray-400">Supports MP3, WAV, M4A (max 10MB)</p>
            </div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium mb-4 text-gray-900">Audio Preview</h3>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={playAudio}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm">{isPlaying ? '⏸' : '▶'}</span>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={clearAudio}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm">×</span>
                Clear
              </button>
            </div>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
              controls
            />
          </div>
        )}

        {/* Process Button */}
        {audioFile && (
          <div className="text-center">
            <button
              onClick={processAudio}
              disabled={isProcessing}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Generate Post'
              )}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Speak clearly and not too fast</li>
            <li>• Avoid background noise</li>
            <li>• Recommended recording time: 1-5 minutes</li>
            <li>• You can upload existing audio files</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

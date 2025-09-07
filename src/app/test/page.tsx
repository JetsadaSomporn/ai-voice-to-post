'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function TestPage() {
  const { user, loading } = useAuth()
  const [testUrl] = useState('https://bywfiuvmcqfeiubiwsqq.supabase.co/storage/v1/object/public/audio-files/a76fb39e-1efe-48fa-a686-4feee77b2762/1751343425989-videoplayback.m4a')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    console.log(message)
    setResults(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 15)])
  }

  const testStorageAPI = async () => {
    try {
      setIsLoading(true)
      addResult('🔍 Testing storage info API...')
      
      const response = await fetch('/api/storage-info')
      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Bucket: ${data.bucket?.name} (${data.bucket?.public ? 'public' : 'private'})`)
        addResult(`📁 Files: ${data.filesCount}`)
      } else {
        addResult(`❌ Storage API Error: ${data.error}`)
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPublicURL = async () => {
    try {
      setIsLoading(true)
      addResult(`🔗 Testing public URL...`)
      
      const response = await fetch(testUrl)
      addResult(`📊 Response: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        const blob = await response.blob()
        addResult(`✅ Success! Size: ${blob.size} bytes, Type: ${blob.type}`)
      } else {
        addResult(`❌ Failed to fetch audio file`)
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testTranscribeAPI = async () => {
    try {
      setIsLoading(true)
      addResult(`🎤 Testing transcribe API...`)
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: testUrl })
      })
      
      const data = await response.json()
      addResult(`📊 API Response: ${response.status}`)
      
      if (response.ok) {
        addResult(`✅ Success! Transcript: ${data.transcript?.substring(0, 100)}...`)
      } else {
        addResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCompleteFlow = async () => {
    try {
      setIsLoading(true)
      addResult(`🚀 Testing complete flow...`)
      
      // Test storage
      await testStorageAPI()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Test public URL
      await testPublicURL()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Test transcribe
      await testTranscribeAPI()
      
      addResult(`🎉 Complete flow test finished`)
    } catch (error) {
      addResult(`❌ Flow Exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Login</h2>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Storage & Transcribe Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">User Info</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={testStorageAPI}
          disabled={isLoading}
          className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Storage API
        </button>
        
        <button
          onClick={testPublicURL}
          disabled={isLoading}
          className="p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Public URL
        </button>
        
        <button
          onClick={testTranscribeAPI}
          disabled={isLoading}
          className="p-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Test Transcribe
        </button>
        
        <button
          onClick={testCompleteFlow}
          disabled={isLoading}
          className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test All
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <button
          onClick={() => setResults([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
      
      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="text-yellow-400 mb-2">⏳ Testing in progress...</div>
        )}
        {results.length === 0 ? (
          <div className="text-gray-400">Click a test button to start...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Test URL:</h3>
        <p className="text-sm text-gray-600 break-all">{testUrl}</p>
      </div>
    </div>
  )
}

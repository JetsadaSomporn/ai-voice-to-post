'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export default function QuickStorageTest() {
  const { user } = useAuth()
  const [testUrl, setTestUrl] = useState('https://bywfiuvmcqfeiubiwsqq.supabase.co/storage/v1/object/public/audio-files/a76fb39e-1efe-48fa-a686-4feee77b2762/1751343425989-videoplayback.m4a')
  const [results, setResults] = useState<string[]>([])
  const supabase = createClient()

  const addResult = (message: string) => {
    console.log(message)
    setResults(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 20)])
  }

  const testPublicUrl = async () => {
    try {
      addResult(`🔗 Testing public URL: ${testUrl}`)
      
      const response = await fetch(testUrl)
      addResult(`📊 Response: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        const contentLength = response.headers.get('content-length')
        addResult(`✅ Success! Content-Type: ${contentType}, Size: ${contentLength} bytes`)
        
        // Try to read blob
        const blob = await response.blob()
        addResult(`📁 Blob size: ${blob.size} bytes, type: ${blob.type}`)
      } else {
        const errorText = await response.text()
        addResult(`❌ Error: ${errorText}`)
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`)
    }
  }

  const testSignedUrl = async () => {
    try {
      // Extract file path from public URL
      const filePath = testUrl.split('/storage/v1/object/public/audio-files/')[1]
      addResult(`📁 File path: ${filePath}`)
      
      const { data, error } = await supabase.storage
        .from('audio-files')
        .createSignedUrl(filePath, 300)
      
      if (error) {
        addResult(`❌ Signed URL error: ${error.message}`)
        return
      }
      
      addResult(`🔗 Signed URL: ${data.signedUrl}`)
      
      // Test signed URL
      const response = await fetch(data.signedUrl)
      addResult(`📊 Signed URL Response: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        const blob = await response.blob()
        addResult(`✅ Signed URL works! Blob size: ${blob.size} bytes`)
      }
      
    } catch (error) {
      addResult(`❌ Signed URL exception: ${error}`)
    }
  }

  const testDirectDownload = async () => {
    try {
      const filePath = testUrl.split('/storage/v1/object/public/audio-files/')[1]
      addResult(`📁 Direct download for: ${filePath}`)
      
      const { data, error } = await supabase.storage
        .from('audio-files')
        .download(filePath)
      
      if (error) {
        addResult(`❌ Direct download error: ${error.message}`)
        return
      }
      
      addResult(`✅ Direct download success! Size: ${data.size} bytes`)
      
    } catch (error) {
      addResult(`❌ Direct download exception: ${error}`)
    }
  }

  const testTranscribeAPI = async () => {
    try {
      addResult(`🎤 Testing transcribe API with URL: ${testUrl}`)
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioUrl: testUrl
        })
      })
      
      addResult(`📊 API Response: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ API Success! 🎉`)
        addResult(`📝 Transcript: ${data.transcript?.substring(0, 200)}${data.transcript?.length > 200 ? '...' : ''}`)
        if (data.processingTime) addResult(`⏱️ Processing time: ${data.processingTime}`)
      } else {
        addResult(`❌ API Error: ${data.error}`)
        if (data.details) addResult(`Details: ${data.details}`)
      }
      
    } catch (error) {
      addResult(`❌ API Exception: ${error}`)
    }
  }

  const checkBucketConfig = async () => {
    try {
      addResult('🔍 Checking bucket configuration via API...')
      
      const response = await fetch('/api/storage-info')
      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Storage API Response received`)
        addResult(`📦 Bucket found: ${data.bucket.name}`)
        addResult(`🔓 Is Public: ${data.bucket.public ? 'YES' : 'NO'}`)
        addResult(`📁 Files count: ${data.filesCount}`)
        if (data.allBuckets) {
          addResult(`📋 All buckets: ${data.allBuckets.map((b: any) => `${b.name}(${b.public ? 'public' : 'private'})`).join(', ')}`)
        }
      } else {
        addResult(`❌ Storage API Error: ${data.error}`)
        if (data.details) addResult(`Details: ${data.details}`)
        if (data.availableBuckets) addResult(`Available buckets: ${data.availableBuckets.join(', ')}`)
      }
      
    } catch (error) {
      addResult(`❌ Storage API Exception: ${error}`)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Quick Storage Test</h1>
        <p className="text-red-600">Please login to test storage functionality.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Quick Storage Test</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Test URL:</label>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={checkBucketConfig}
          className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Check Bucket Config
        </button>
        
        <button
          onClick={testPublicUrl}
          className="p-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Public URL
        </button>
        
        <button
          onClick={testSignedUrl}
          className="p-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Test Signed URL
        </button>
        
        <button
          onClick={testDirectDownload}
          className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Test Direct Download
        </button>
        
        <button
          onClick={testTranscribeAPI}
          className="p-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Transcribe API
        </button>
        
        <button
          onClick={() => setResults([])}
          className="p-3 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        <h3 className="text-white mb-2">Test Results:</h3>
        {results.length === 0 ? (
          <div className="text-gray-400">Click a test button to start...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))
        )}
      </div>
    </div>
  )
}

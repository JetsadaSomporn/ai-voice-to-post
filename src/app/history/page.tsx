'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Record {
  id: string
  transcript: string
  summary: string
  generated_post: string
  style: string
  created_at: string
}

export default function HistoryPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  
  const { user, session, loading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return // Wait for auth to load
    
    if (!user || !session) {
      router.push('/login')
      return
    }
    
    fetchRecords(user.id)
  }, [user, session, authLoading, router])

  const fetchRecords = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (id: string) => {
    if (!confirm('คุณต้องการลบบันทึกนี้หรือไม่?')) return

    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id)

      if (error) throw error
      setRecords(records.filter(record => record.id !== id))
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="h-12 w-12 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Loading history...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user || !session) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to sign in to view your history.</p>
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded text-sm">H</span>
          Usage History
        </h1>
        <button
          onClick={() => router.push('/record')}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span className="text-sm">🎙</span>
          New Recording
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No usage history yet</h2>
          <p className="text-gray-500 mb-6">Start creating your first post!</p>
          <button
            onClick={() => router.push('/record')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Recording
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-sm">📅</span>
                  {formatDate(record.created_at)}
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {record.style}
                  </span>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <span className="text-sm">🗑</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Summary */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded p-3 text-sm">
                    {record.summary}
                  </p>
                </div>

                {/* Generated Post */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Generated Post</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans">
                      {record.generated_post}
                    </pre>
                  </div>
                </div>

                {/* Transcript (collapsible) */}
                <details className="group">
                  <summary className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer hover:text-gray-700 transition-colors">
                    <span className="text-sm">👁</span>
                    View full text
                  </summary>
                  <div className="mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded p-3 text-sm">
                    {record.transcript}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade prompt */}
      <div className="mt-8 bg-gray-900 text-white rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium mb-2">Upgrade to Plus</h3>
        <p className="mb-4">Unlimited usage + Save more history + Premium features</p>
        <button
          onClick={() => router.push('/upgrade')}
          className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}

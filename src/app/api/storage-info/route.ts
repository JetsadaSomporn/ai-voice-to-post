import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Get current user (for auth check)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      return NextResponse.json({ 
        error: 'Failed to list buckets', 
        details: bucketsError.message 
      }, { status: 500 })
    }

    const audioFilesBucket = buckets?.find(b => b.name === 'audio-files')
    
    if (!audioFilesBucket) {
      return NextResponse.json({ 
        error: 'audio-files bucket not found',
        availableBuckets: buckets?.map(b => b.name) || []
      }, { status: 404 })
    }

    // Test file listing
    const { data: files, error: filesError } = await supabase.storage
      .from('audio-files')
      .list('', { limit: 5 })

    return NextResponse.json({
      success: true,
      bucket: audioFilesBucket,
      filesCount: files?.length || 0,
      allBuckets: buckets?.map(b => ({ name: b.name, public: b.public })) || []
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Server error',
      details: error.message
    }, { status: 500 })
  }
}

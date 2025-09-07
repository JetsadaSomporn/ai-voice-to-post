import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limit using database function
    const { data, error } = await supabase.rpc('check_usage_limit', {
      user_uuid: user.id
    })

    if (error) {
      console.error('Error checking usage limit:', error)
      return NextResponse.json(
        { error: 'Failed to check usage limit' },
        { status: 500 }
      )
    }

    // Get user profile for additional info
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, usage_count, usage_reset_date')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      canUse: data,
      profile: {
        plan: profile?.plan || 'free',
        usageCount: profile?.usage_count || 0,
        usageResetDate: profile?.usage_reset_date,
        maxUsage: profile?.plan === 'plus' ? -1 : 3 // -1 means unlimited
      }
    })

  } catch (error: any) {
    console.error('Usage check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Increment usage count
    const { error } = await supabase.rpc('increment_usage', {
      user_uuid: user.id
    })

    if (error) {
      console.error('Error incrementing usage:', error)
      return NextResponse.json(
        { error: 'Failed to update usage count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Usage increment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

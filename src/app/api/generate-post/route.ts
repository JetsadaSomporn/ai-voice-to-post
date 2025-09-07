import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('📝 Generate Post API: Auth check', { hasUser: !!user, userError })
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transcript, style = 'Facebook', recordId } = await request.json()
    
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create prompt based on style
    const stylePrompts = {
      Facebook: `สร้างโพสต์ Facebook ที่น่าสนใจและดึงดูดการมีส่วนร่วม ใช้ภาษาไทยที่เป็นกันเอง มี emoji ประกอบ และมีการขึ้นบรรทัดให้อ่านง่าย`,
      IG: `สร้างแคปชัน Instagram ที่สั้นกระชับ ใช้ emoji และ hashtag ที่เกี่ยวข้อง เหมาะสำหรับการโพสต์รูปภาพ`,
      Twitter: `สร้างทวีตที่กระชับไม่เกิน 280 ตัวอักษร เน้นข้อความที่ชัดเจน มีประเด็น และใช้ hashtag ที่เกี่ยวข้อง`
    }

    const prompt = `
คำแนะนำ: สรุปเนื้อหาจากข้อความที่ถอดเสียง แล้วแปลงเป็นโพสต์แนว ${style}

${stylePrompts[style as keyof typeof stylePrompts]}

ข้อความที่ถอดเสียง: "${transcript}"

กรุณาตอบในรูปแบบ JSON ดังนี้:
{
  "summary": "สรุปเนื้อหาหลักที่สำคัญ",
  "post": "โพสต์ที่เขียนแล้วพร้อมใช้"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON response
    let parsedResponse
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, '')
      parsedResponse = JSON.parse(cleanText)
    } catch (parseError) {
      // If JSON parsing fails, create a basic response
      parsedResponse = {
        summary: "ไม่สามารถสรุปเนื้อหาได้",
        post: text
      }
    }

    const processingTime = Date.now() - startTime

    // Save record to database if user is Plus
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (profile?.plan === 'plus') {
      const recordData = {
        user_id: user.id,
        transcript,
        summary: parsedResponse.summary,
        generated_post: parsedResponse.post,
        style,
        processing_time: `${processingTime}ms`
      }

      if (recordId) {
        // Update existing record
        await supabase
          .from('records')
          .update(recordData)
          .eq('id', recordId)
          .eq('user_id', user.id)
      } else {
        // Create new record
        await supabase
          .from('records')
          .insert(recordData)
      }
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'generate_post',
      processing_time: `${processingTime}ms`
    })

    return NextResponse.json({
      summary: parsedResponse.summary,
      post: parsedResponse.post,
      style,
      success: true,
      processingTime: `${processingTime}ms`
    })

  } catch (error: any) {
    console.error('Generate post error:', error)
    return NextResponse.json(
      { error: 'Failed to generate post', details: error.message },
      { status: 500 }
    )
  }
}

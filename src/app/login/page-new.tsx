'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        router.push('/record')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })
        if (error) throw error
        
        if (data.user && !data.session) {
          setError('กรุณาตรวจสอบอีเมลเพื่อยืนยันการสมัครสมาชิก')
        } else {
          router.push('/record')
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/record`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          
          {/* Animated Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold">Voice2Post</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  แปลงเสียง<br />
                  เป็นโพสต์<br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ใน 30 วินาที
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-md">
                  เทคโนโลยี AI ล่าสุดจาก Google ช่วยให้คุณสร้างเนื้อหาโซเชียลได้อย่างรวดเร็วและง่ายดาย
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">1,000+</div>
                  <div className="text-sm text-gray-400">ผู้ใช้งาน</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">95%</div>
                  <div className="text-sm text-gray-400">ความแม่นยำ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">30s</div>
                  <div className="text-sm text-gray-400">ประมวลผล</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Voice2Post
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'ยินดีต้อนรับกลับ' : 'เริ่มต้นใช้งาน'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'เข้าสู่ระบบเพื่อใช้งาน Voice2Post' : 'สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน'}
              </p>
            </div>

            {/* Google Sign In */}
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'กำลังเข้าสู่ระบบ...' : `${isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}ด้วย Google`}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">หรือ</span>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="กรอกอีเมล"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="กรอกรหัสผ่าน"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                <span className="flex items-center justify-center">
                  {loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-gray-600">
                {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}{' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setEmail('')
                    setPassword('')
                    setFullName('')
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบที่นี่'}
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

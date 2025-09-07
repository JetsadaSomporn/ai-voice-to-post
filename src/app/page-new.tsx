import Link from "next/link";
import { Mic, Bot, FileText, Zap, Users, Clock, Shield, CheckCircle, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              <Star className="h-4 w-4" />
              AI-Powered Voice to Social Media
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            แปลง<span className="text-blue-600">เสียง</span>เป็น<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              โพสต์โซเชียล
            </span>
            <span className="text-gray-900"> ใน 30 วินาที</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            ใช้เทคโนโลยี <span className="font-bold text-blue-600">Google Gemini AI</span> ล่าสุดในการถอดเสียงและสร้างเนื้อหาโซเชียลมีเดีย<br />
            <span className="text-green-600 font-semibold">ประหยัดเวลาได้กว่า 90%</span> สำหรับนักการตลาด ครีเอเตอร์ และผู้ประกอบการ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/record"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" />
              เริ่มใช้งานฟรี
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="bg-white border-2 border-gray-200 text-gray-800 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1,000+</div>
                <div className="text-gray-600 font-medium">ผู้ใช้งาน</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">30 วินาที</div>
                <div className="text-gray-600 font-medium">ประมวลผล</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-gray-600 font-medium">ปลอดภัย</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ทำไมต้อง <span className="text-blue-600">Voice2Post</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              เครื่องมือที่ทรงพลังและใช้งานง่ายที่สุดสำหรับการสร้างเนื้อหาโซเชียลมีเดีย
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Mic className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">1. อัดเสียงง่าย</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                แค่กดปุ่มและพูด หรืออัปโหลดไฟล์เสียงที่มีอยู่<br />
                <span className="font-semibold text-blue-600">รองรับไฟล์ทุกรูปแบบ</span>
              </p>
              <div className="mt-6 flex justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">2. AI ประมวลผลทันที</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold text-green-600">Google Gemini AI</span> ถอดเสียงและสร้างโพสต์<br />
                ความแม่นยำสูงกว่า 95%
              </p>
              <div className="mt-6 flex justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3. โพสต์พร้อมใช้</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                รับโพสต์ที่พร้อมโพสต์บน<br />
                <span className="font-semibold text-purple-600">Facebook, Instagram, Twitter</span>
              </p>
              <div className="mt-6 flex justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              เหมาะสำหรับทุกคน
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              ไม่ว่าคุณจะเป็นใคร Voice2Post ช่วยให้การสร้างเนื้อหาง่ายขึ้น
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">นักการตลาด</h3>
              <p className="opacity-90">สร้างคอนเทนต์ได้เร็วขึ้น</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-2">ครีเอเตอร์</h3>
              <p className="opacity-90">แปลงไอเดียเป็นโพสต์</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">ครูผู้สอน</h3>
              <p className="opacity-90">แชร์ความรู้ง่ายขึ้น</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-2">ผู้ประกอบการ</h3>
              <p className="opacity-90">สื่อสารแบรนด์ได้ดี</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            พร้อมเริ่มต้นแล้วใช่ไหม?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            เริ่มสร้างโพสต์โซเชียลจากเสียงของคุณได้เลยตอนนี้ ฟรี!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/record"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" />
              เริ่มใช้งานฟรี
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/upgrade"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <Zap className="h-6 w-6" />
              ดู Plus Plan
            </Link>
          </div>
          
          <p className="text-gray-500 mt-8">
            ✨ ไม่ต้องใช้บัตรเครดิต • ใช้งานได้ทันที • ปลอดภัย 100%
          </p>
        </div>
      </section>
    </div>
  );
}

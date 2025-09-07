import Link from "next/link";
import { Mic, Bot, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🎙️ แปลงเสียงเป็น
            <span className="text-blue-600"> โพสต์โซเชียล</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            พูดใส่ไมโครโฟน AI จะช่วยถอดเสียง สรุปเนื้อหา และเขียนโพสต์ให้พร้อมใช้
            เหมาะสำหรับนักพูด ครูผู้สอน และคนที่ไม่ถนัดเขียนโพสต์
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/record"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mic className="h-5 w-5" />
              เริ่มอัดเสียง
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            วิธีการใช้งาน
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. อัดเสียง</h3>
              <p className="text-gray-600">
                พูดเล่าเนื้อหาที่ต้องการ หรืออัปโหลดไฟล์เสียงที่มีอยู่
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI ประมวลผล</h3>
              <p className="text-gray-600">
                AI ถอดเสียงเป็นข้อความ แล้วสรุปและเขียนโพสต์ให้
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. ได้โพสต์พร้อมใช้</h3>
              <p className="text-gray-600">
                คัดลอกโพสต์ไปใช้ใน Facebook, Instagram, Twitter ได้เลย
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            แผนการใช้งาน
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ฟรี
                <span className="text-lg font-normal text-gray-600">/เดือน</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>ใช้ได้วันละ 3 ครั้ง</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>โพสต์สไตล์พื้นฐาน</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4">×</span>
                  <span>ไม่เก็บประวัติ</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                เริ่มใช้ฟรี
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  แนะนำ
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Plus</h3>
              <p className="text-3xl font-bold mb-6">
                ฿299
                <span className="text-lg font-normal">/เดือน</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>ใช้ได้ไม่จำกัด</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>โพสต์หลากหลายสไตล์</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>บันทึกประวัติได้</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Export PDF</span>
                </li>
              </ul>
              <Link
                href="/upgrade"
                className="block w-full text-center bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                อัปเกรดเลย
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมแปลงเสียงเป็นโพสต์แล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เริ่มใช้งานได้เลยฟรี ไม่ต้องใส่บัตรเครดิต
          </p>
          <Link
            href="/record"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Mic className="h-5 w-5" />
            เริ่มอัดเสียงเลย
          </Link>
        </div>
      </section>
    </div>
  );
}

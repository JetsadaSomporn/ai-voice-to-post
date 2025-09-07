import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">
              AI Voice to Social Media
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 leading-tight">
            Transform Voice<br />
            to Social Posts<br />
            <span className="text-gray-600">in 30 Seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Powered by Google Gemini AI for accurate transcription and intelligent content generation.<br />
            Save 90% of your time creating social media content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/record"
              className="bg-gray-900 text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="bg-white border border-gray-200 text-gray-900 px-10 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">1,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">30 Sec</div>
              <div className="text-gray-600">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your voice into engaging social media content
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
                1
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Record</h3>
              <p className="text-gray-600 leading-relaxed">
                Record your voice or upload an audio file. 
                Supports all major audio formats.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
                2
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Google Gemini AI transcribes and generates 
                optimized content for your platform.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
                3
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Get ready-to-post content for Facebook, 
                Instagram, and Twitter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Perfect for everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a marketer, creator, or business owner
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Marketers</h3>
              <p className="text-gray-600 text-sm">Create content faster</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Creators</h3>
              <p className="text-gray-600 text-sm">Turn ideas into posts</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Educators</h3>
              <p className="text-gray-600 text-sm">Share knowledge easily</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Business</h3>
              <p className="text-gray-600 text-sm">Communicate better</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start creating social media posts from your voice today. Free to try.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/record"
              className="bg-gray-900 text-white px-12 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Free
            </Link>
            
            <Link
              href="/upgrade"
              className="bg-white border border-gray-200 text-gray-900 px-12 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Plans
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            No credit card required • Instant access • 100% secure
          </p>
        </div>
      </section>
    </div>
  );
}

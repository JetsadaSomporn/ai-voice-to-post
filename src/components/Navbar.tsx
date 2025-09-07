'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-xl font-semibold text-gray-900">Voice2Post</span>
            </Link>
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-gray-900">
              Voice2Post
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  href="/record"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Record
                </Link>
                <Link
                  href="/history"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/plan"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Plans
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/record"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Record
                  </Link>
                  <Link
                    href="/history"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    href="/plan"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Plans
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors mx-4"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

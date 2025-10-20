'use client'

import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { signOut, user, isHydrated } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/welcome')
  }

  // Prevent hydration mismatch by only rendering user info after hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {user && <p className="text-sm text-gray-600 mt-1">{user.name || user.email}</p>}
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back{user?.name ? `, ${user.name}` : ''}! 🎉
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                You&apos;ve successfully signed in. Your authentication token is stored securely and will be used for
                all API requests.
              </p>
              {user && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Account Details:</h3>
                  <div className="space-y-1 text-sm">
                    {user.name && (
                      <p>
                        <span className="font-medium">Name:</span> {user.name}
                      </p>
                    )}
                    {user.email && (
                      <p>
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">User ID:</span> {user.user_id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-indigo-600 text-3xl mb-2">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Secure</h3>
              <p className="text-gray-600 text-sm">JWT authentication active</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-green-600 text-3xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Authenticated</h3>
              <p className="text-gray-600 text-sm">You&apos;re logged in</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-purple-600 text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready</h3>
              <p className="text-gray-600 text-sm">Start using the app</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ What&apos;s Next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• All your GraphQL requests will now include your authentication token</li>
              <li>• Your session persists across browser refreshes (stored in localStorage)</li>
              <li>• Click &quot;Sign Out&quot; to clear your session and return to the welcome page</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

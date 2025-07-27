'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-blue-900 mb-4">
              Quick Little Shop
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your trusted community marketplace where neighbors connect
            </p>
            
            {!loading && !user && (
              <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                <h3 className="text-lg font-semibold mb-2">Join Your Community</h3>
                <p className="text-gray-600 mb-4">
                  Sign up to start buying and selling with verified neighbors
                </p>
              </div>
            )}
          </div>

          {/* User Status */}
          {loading ? (
            <div className="text-center">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : user ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.user_metadata?.full_name || 'Not set'}</p>
                <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🎉 Authentication Working!</h3>
                <p className="text-green-700">
                  You&apos;re successfully logged in. Next up: creating your marketplace profile and posting items!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Join Quick Little Shop to buy and sell items with your trusted neighbors.
              </p>
              <p className="text-sm text-gray-500">
                Click &ldquo;Sign Up&rdquo; in the navigation to create your account
              </p>
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold mb-2">Community Verified</h3>
              <p className="text-gray-600">
                Only verified neighbors can join your local marketplace
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Safe Messaging</h3>
              <p className="text-gray-600">
                Connect with buyers and sellers through secure in-app messaging
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold mb-2">Local Meetups</h3>
              <p className="text-gray-600">
                Meet in person for safe, convenient exchanges
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
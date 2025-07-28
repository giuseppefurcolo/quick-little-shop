'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function SellPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [location, setLocation] = useState('')

  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Books',
    'Sports & Outdoors',
    'Home & Garden',
    'Toys & Games',
    'Health & Food',
    'Vehicles',
    'Art',
    'Automotive',
    'Other'
  ]

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair'
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('items')
        .insert({
          user_id: user?.id,
          title,
          description,
          price: parseFloat(price),
          category,
          condition,
          location,
          status: 'active'
        })

      if (error) throw error

      setMessage('Item posted successfully! 🎉')
      
      // Reset form
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('')
      setCondition('')
      setLocation('')

      // Redirect to marketplace after success
      setTimeout(() => {
        router.push('/marketplace')
      }, 2000)

    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error posting item')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              List an Item for Sale
            </h1>
            <p className="text-gray-600 mb-8">
              Share details about your item to connect with interested buyers in your community.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., iPhone 13, Dining Table, Mountain Bike, Painting"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your item, its condition, why you're selling it..."
                  required
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition and Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Downtown, Near Beach"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded text-sm ${
                  message.includes('Error') || message.includes('error')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
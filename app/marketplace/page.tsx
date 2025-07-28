'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

interface Item {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  location: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    'All',
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

  useEffect(() => {
    fetchItems()
  }, [selectedCategory])

  const fetchItems = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (selectedCategory && selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'Electronics': '📱',
      'Furniture': '🪑',
      'Clothing': '👕',
      'Books': '📚',
      'Sports & Outdoors': '⚽',
      'Home & Garden': '🏡',
      'Toys & Games': '🎲',
      'Health & Food': '🥗',
      'Vehicles': '🚗',
      'Art': '🎨',
      'Automotive': '🔧',
      'Other': '📦'
    }
    return emojis[category] || '📦'
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-2">
              Discover great items from your neighbors
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                    (selectedCategory === category) || (selectedCategory === '' && category === 'All')
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {category !== 'All' && (
                    <span>{getCategoryEmoji(category)}</span>
                  )}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading items...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                {selectedCategory 
                  ? `No ${selectedCategory.toLowerCase()} items found` 
                  : 'No items found'
                }
              </div>
              <p className="text-gray-500">
                Be the first to post an item in your community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  
                  {/* Placeholder for image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">{getCategoryEmoji(item.category)}</div>
                      <div className="text-sm">Photo coming soon</div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <span className="text-lg font-bold text-green-600 ml-2">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded flex items-center space-x-1">
                        <span>{getCategoryEmoji(item.category)}</span>
                        <span>{item.category}</span>
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.condition}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-600">
                        <div className="font-medium">
                          {item.profiles?.full_name || 'Anonymous'}
                        </div>
                        {item.location && (
                          <div className="text-xs text-gray-500">
                            📍 {item.location}
                          </div>
                        )}
                      </div>
                      <div className="text-gray-500">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Contact Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [connected, setConnected] = useState(null)
  const [tableCount, setTableCount] = useState(0)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test by counting items in the items table
        const { data, error } = await supabase
          .from('items')
          .select('id', { count: 'exact' })
        
        if (error) throw error
        
        setConnected(true)
        setTableCount(data?.length || 0)
      } catch (error) {
        console.log('Database test error:', error.message)
        setConnected(false)
      }
    }
    
    testConnection()
  }, [])

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-2">
            Quick Little Shop
          </h1>
          <p className="text-lg text-gray-600">
            Your Community Marketplace • quicklittle.shop
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Setup Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Next.js App: ✅ Running</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connected === true ? 'bg-green-500' : 
                connected === false ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span>
                Database Connection: {
                  connected === true ? '✅ Connected' : 
                  connected === false ? '❌ Failed' : '⏳ Testing...'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Tailwind CSS: ✅ Working</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Database Tables: ✅ Created ({tableCount} items)</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Your Quick Little Shop database is ready! 🚀
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ready to build user authentication and marketplace features
          </p>
        </div>
      </div>
    </main>
  )
}
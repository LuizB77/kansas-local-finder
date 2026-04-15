import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CategoryPicker from '../components/CategoryPicker'

export default function Home() {
  const [category, setCategory] = useState(null)
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  function handleSearch(keyword) {
    setLoading(true)
    // Pass keyword + category to Results via query params
    const params = new URLSearchParams()
    if (keyword)  params.set('q', keyword)
    if (category) params.set('cat', category)
    navigate(`/results?${params.toString()}`)
  }

  function handleCategory(cat) {
    setCategory(cat)
    if (cat) {
      const params = new URLSearchParams({ cat })
      navigate(`/results?${params.toString()}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50
                     flex flex-col items-center justify-center px-4 gap-10">

      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
          Kansas <span className="text-primary">Local</span> Finder
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Discover the best local businesses near you — coffee shops, restaurants, auto shops, and more.
        </p>
      </div>

      {/* Search */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Categories */}
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
          Or browse by category
        </p>
        <CategoryPicker active={category} onSelect={handleCategory} />
      </div>

    </main>
  )
}

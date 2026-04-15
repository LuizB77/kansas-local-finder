import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { usePlaces } from '../hooks/usePlaces'
import { sortByRating, sortByName } from '../utils/formatBusiness'
import FilterBar from '../components/FilterBar'
import BusinessCard from '../components/BusinessCard'
import SkeletonCard from '../components/SkeletonCard'
import MapView from '../components/MapView'

const DEFAULT_LAT = 39.0473   // Topeka, KS
const DEFAULT_LNG = -95.6752

export default function Results() {
  const [searchParams] = useSearchParams()
  const navigate        = useNavigate()
  const keyword         = searchParams.get('q')   ?? ''
  const category        = searchParams.get('cat') ?? ''

  const { data, loading, error, search } = usePlaces()
  const [sort, setSort]   = useState('rating')
  const [view, setView]   = useState('grid')

  // Trigger search when params change
  useEffect(() => {
    if (!keyword && !category) return
    search({
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
      category: category || null,
      keyword:  keyword  || null,
    })
  }, [keyword, category])

  // Apply sort
  const results = useMemo(() => {
    if (!data.length) return []
    return sort === 'rating' ? sortByRating(data) : sortByName(data)
  }, [data, sort])

  const skeletons = Array.from({ length: 8 })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-primary font-bold text-xl tracking-tight">
          KLF
        </Link>
        <span className="text-gray-300">|</span>
        <div className="flex gap-2 text-sm text-gray-500">
          {keyword  && <span>"{keyword}"</span>}
          {category && (
            <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {category}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="ml-auto text-sm text-primary hover:underline"
        >
          ← New Search
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* Filter bar */}
        <FilterBar
          sort={sort}
          onSort={setSort}
          view={view}
          onViewToggle={setView}
          total={results.length}
          loading={loading}
        />

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Map view */}
        {view === 'map' && !loading && (
          <MapView businesses={results} />
        )}

        {/* Grid view */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? skeletons.map((_, i) => <SkeletonCard key={i} />)
              : results.map(biz => <BusinessCard key={biz.id} business={biz} />)
            }
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-20 text-gray-400 space-y-2">
            <p className="text-4xl">🔍</p>
            <p className="font-medium">No results found</p>
            <p className="text-sm">Try a different search term or category</p>
          </div>
        )}

      </div>
    </div>
  )
}

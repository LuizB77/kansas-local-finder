import { useState, useCallback } from 'react'
import { searchNearby } from '../utils/placesApi'
import { formatBusinessList } from '../utils/formatBusiness'

export function usePlaces() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [query, setQuery]     = useState({ keyword: '', category: '' })

  const search = useCallback(async ({ lat, lng, category, keyword }) => {
    setLoading(true)
    setError(null)
    setQuery({ keyword: keyword ?? '', category: category ?? '' })

    try {
      const raw = await searchNearby({ lat, lng, category, radius: 5000 })
      const formatted = formatBusinessList(raw)
      setData(formatted)
    } catch (err) {
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData([])
    setError(null)
    setQuery({ keyword: '', category: '' })
  }, [])

  return { data, loading, error, query, search, reset }
}

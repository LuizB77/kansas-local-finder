import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search businesses near you…"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-primary text-gray-700
                   placeholder:text-gray-400 bg-white"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-3 rounded-xl bg-primary text-white font-semibold
                   hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}

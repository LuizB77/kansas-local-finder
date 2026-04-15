const SORT_OPTIONS = [
  { value: 'rating', label: '★ Top Rated' },
  { value: 'name',   label: 'A–Z Name'    },
]

export default function FilterBar({ sort, onSort, view, onViewToggle, total, loading }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3
                    bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">

      {/* Result count */}
      <p className="text-sm text-gray-500">
        {loading
          ? 'Searching…'
          : total > 0
            ? `${total} result${total !== 1 ? 's' : ''} found`
            : 'No results'}
      </p>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <select
          value={sort}
          onChange={e => onSort(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
                     focus:outline-none focus:ring-2 focus:ring-primary text-gray-600"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Grid / Map toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => onViewToggle('grid')}
            title="Grid view"
            className={`px-3 py-1.5 text-sm transition
                        ${view === 'grid'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => onViewToggle('map')}
            title="Map view"
            className={`px-3 py-1.5 text-sm transition border-l border-gray-200
                        ${view === 'map'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            🗺 Map
          </button>
        </div>
      </div>
    </div>
  )
}

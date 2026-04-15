const CATEGORIES = ['Food', 'Coffee', 'Auto', 'Health', 'Shopping', 'Entertainment']

const ICONS = {
  Food:          '🍽️',
  Coffee:        '☕',
  Auto:          '🔧',
  Health:        '💊',
  Shopping:      '🛍️',
  Entertainment: '🎬',
}

export default function CategoryPicker({ active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat === active ? null : cat)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium
                      border transition text-sm
                      ${cat === active
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                      }`}
        >
          <span>{ICONS[cat]}</span>
          {cat}
        </button>
      ))}
    </div>
  )
}

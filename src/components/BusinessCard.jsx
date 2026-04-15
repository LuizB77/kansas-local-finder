import { Link } from 'react-router-dom'

function RatingBadge({ rating }) {
  if (rating === null) return <span className="text-gray-400 text-sm">No rating</span>
  const color =
    rating >= 4.5 ? 'text-green-600' :
    rating >= 3.5 ? 'text-yellow-500' :
                    'text-red-500'
  return <span className={`font-bold text-lg ${color}`}>★ {rating.toFixed(1)}</span>
}

function OpenBadge({ isOpen }) {
  if (isOpen === null) return null
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {isOpen ? 'Open' : 'Closed'}
    </span>
  )
}

export default function BusinessCard({ business }) {
  const { id, name, address, rating, reviewCount, isOpen, photoUrl, type } = business

  return (
    <Link
      to={`/business/${id}`}
      className="block bg-white border border-gray-200 rounded-2xl overflow-hidden
                 shadow-sm hover:shadow-md transition group"
    >
      {/* Photo */}
      <div className="h-40 bg-gray-100 overflow-hidden">
        {photoUrl
          ? <img src={photoUrl} alt={name}
                 className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📍</div>
        }
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{name}</h3>
          <OpenBadge isOpen={isOpen} />
        </div>
        {type && <p className="text-xs text-primary font-medium">{type}</p>}
        <div className="flex items-center gap-2">
          <RatingBadge rating={rating} />
          {reviewCount > 0 && (
            <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
          )}
        </div>
        <p className="text-xs text-gray-400 line-clamp-1">{address}</p>
      </div>
    </Link>
  )
}

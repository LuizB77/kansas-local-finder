import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlaceDetails } from '../utils/placesApi'
import { formatBusiness, getDirectionsUrl } from '../utils/formatBusiness'

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 max-w-2xl mx-auto px-4 py-10">
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  )
}

function InfoRow({ icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer"
               className="text-primary text-sm hover:underline break-all">{value}</a>
          : <p className="text-gray-700 text-sm">{value}</p>
        }
      </div>
    </div>
  )
  return content
}

export default function BusinessDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [biz,  setBiz]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getPlaceDetails(`places/${id}`)
      .then(raw  => setBiz(formatBusiness(raw)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailSkeleton />

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-red-500 font-medium">⚠️ {error}</p>
      <button onClick={() => navigate(-1)}
              className="text-primary text-sm hover:underline">← Go back</button>
    </div>
  )

  if (!biz) return null

  const {
    name, address, rating, reviewCount,
    isOpen, photoUrl, type, phone, website,
  } = biz

  const ratingColor =
    rating >= 4.5 ? 'text-green-600' :
    rating >= 3.5 ? 'text-yellow-500' :
                    'text-red-500'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Back nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-medium text-sm hover:underline"
        >
          ← Back to results
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Hero photo */}
        <div className="h-64 rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
          {photoUrl
            ? <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">📍</div>
          }
        </div>

        {/* Name + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-gray-800">{name}</h1>
            {type && <p className="text-primary text-sm font-medium">{type}</p>}
          </div>
          {isOpen !== null && (
            <span className={`shrink-0 text-sm font-semibold px-3 py-1 rounded-full
                              ${isOpen
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100  text-red-600'}`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-extrabold ${ratingColor}`}>
              ★ {rating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              ({reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-2">
          <InfoRow icon="📍" label="Address" value={address} />
          {phone   && <InfoRow icon="📞" label="Phone"   value={phone}   href={`tel:${phone}`} />}
          {website && <InfoRow icon="🌐" label="Website" value={website} href={website} />}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={getDirectionsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-primary text-white font-semibold
                       py-3 rounded-xl hover:bg-opacity-90 transition"
          >
            🗺 Get Directions
          </a>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 text-center bg-white border border-primary text-primary
                         font-semibold py-3 rounded-xl hover:bg-primary hover:text-white transition"
            >
              📞 Call Now
            </a>
          )}
        </div>

      </div>
    </div>
  )
}

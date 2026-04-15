import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { useNavigate } from 'react-router-dom'

const PURPLE = '#7F77DD'

export default function MapView({ businesses }) {
  const mapRef      = useRef(null)
  const instanceRef = useRef(null)
  const markersRef  = useRef([])
  const infoRef     = useRef(null)
  const navigate    = useNavigate()

  useEffect(() => {
    if (!businesses.length) return

    const loader = new Loader({
      apiKey:  import.meta.env.VITE_GOOGLE_PLACES_KEY,
      version: 'weekly',
      libraries: ['marker'],
    })

    loader.load().then(async (google) => {
      const { Map, InfoWindow } = google.maps

      const center = {
        lat: businesses[0].lat ?? 39.0473,
        lng: businesses[0].lng ?? -95.6752,
      }

      // Create map only once
      if (!instanceRef.current) {
        instanceRef.current = new Map(mapRef.current, {
          center,
          zoom: 13,
          mapId: 'kansas-local-finder',
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        })
      } else {
        instanceRef.current.setCenter(center)
      }

      // Clear previous markers
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []

      // Close previous info window
      if (infoRef.current) infoRef.current.close()
      infoRef.current = new InfoWindow()

      businesses.forEach(biz => {
        if (!biz.lat || !biz.lng) return

        // Custom purple pin
        const pin = document.createElement('div')
        pin.innerHTML = `
          <div style="
            width: 36px; height: 36px;
            background: ${PURPLE};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>`

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map:      instanceRef.current,
          position: { lat: biz.lat, lng: biz.lng },
          title:    biz.name,
          content:  pin,
        })

        // Popup card content
        const openBadge = biz.isOpen === null  ? ''
          : biz.isOpen
            ? `<span style="background:#dcfce7;color:#15803d;padding:2px 8px;
                            border-radius:9999px;font-size:11px;font-weight:600;">Open</span>`
            : `<span style="background:#fee2e2;color:#dc2626;padding:2px 8px;
                            border-radius:9999px;font-size:11px;font-weight:600;">Closed</span>`

        const rating = biz.rating
          ? `<span style="font-weight:700;color:#7F77DD;">★ ${biz.rating.toFixed(1)}</span>
             <span style="color:#9ca3af;font-size:12px;">(${biz.reviewCount.toLocaleString()})</span>`
          : `<span style="color:#9ca3af;font-size:12px;">No rating</span>`

        const photo = biz.photoUrl
          ? `<img src="${biz.photoUrl}" alt="${biz.name}"
                  style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
          : ''

        const content = `
          <div style="width:220px;font-family:sans-serif;padding:4px;">
            ${photo}
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#1f2937;">
              ${biz.name}
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              ${rating} ${openBadge}
            </div>
            <p style="font-size:12px;color:#6b7280;margin-bottom:8px;line-height:1.4;">
              ${biz.address}
            </p>
            <button
              onclick="window.__klf_navigate__('${biz.id}')"
              style="width:100%;background:#7F77DD;color:white;border:none;
                     padding:7px;border-radius:8px;font-size:13px;
                     font-weight:600;cursor:pointer;">
              View Details →
            </button>
          </div>`

        marker.addListener('click', () => {
          infoRef.current.setContent(content)
          infoRef.current.open(instanceRef.current, marker)
        })

        markersRef.current.push(marker)
      })
    })

    // Expose navigate to inline onclick in InfoWindow HTML
    window.__klf_navigate__ = (id) => navigate(`/business/${id}`)

    return () => {
      delete window.__klf_navigate__
    }
  }, [businesses])

  if (!businesses.length) {
    return (
      <div className="h-[500px] bg-white border border-gray-200 rounded-2xl
                      flex items-center justify-center text-gray-400">
        No locations to display on map.
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="h-[500px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
    />
  )
}

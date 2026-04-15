import { getPhotoUrl } from './placesApi'

export function formatBusiness(place) {
  const photo = place.photos?.[0]?.name ?? null

  return {
    id:           place.id,
    name:         place.displayName?.text ?? 'Unnamed Business',
    address:      place.formattedAddress ?? '',
    lat:          place.location?.latitude ?? null,
    lng:          place.location?.longitude ?? null,
    rating:       place.rating ?? null,
    reviewCount:  place.userRatingCount ?? 0,
    isOpen:       place.currentOpeningHours?.openNow ?? null,
    photoUrl:     getPhotoUrl(photo),
    type:         place.primaryTypeDisplayName?.text ?? '',
    status:       place.businessStatus ?? 'OPERATIONAL',
    phone:        place.nationalPhoneNumber ?? null,
    website:      place.websiteUri ?? null,
  }
}

export function formatBusinessList(places) {
  return places.map(formatBusiness)
}

// Returns a Google Maps directions URL for a given address
export function getDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

// Sort helpers
export function sortByRating(businesses) {
  return [...businesses].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
}

export function sortByName(businesses) {
  return [...businesses].sort((a, b) => a.name.localeCompare(b.name))
}

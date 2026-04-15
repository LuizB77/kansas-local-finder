const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY
const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby'
const TEXT_URL = 'https://places.googleapis.com/v1/places:searchText'
const DETAILS_BASE = 'https://places.googleapis.com/v1'

// Field masks for Nearby Search
const NEARBY_FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.photos',
  'places.primaryTypeDisplayName',
  'places.businessStatus',
].join(',')

// Field masks for Place Details
const DETAILS_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'currentOpeningHours',
  'photos',
  'nationalPhoneNumber',
  'websiteUri',
  'primaryTypeDisplayName',
  'businessStatus',
].join(',')

// Map category pill labels to Google place types
export const CATEGORY_TYPES = {
  Food:          'restaurant',
  Coffee:        'cafe',
  Auto:          'car_repair',
  Health:        'pharmacy',
  Shopping:      'shopping_mall',
  Entertainment: ['tourist_attraction', 'amusement_park', 'night_club',
                  'art_gallery', 'museum', 'zoo', 'bowling_alley',
                  'movie_theater', 'performing_arts_theater'],
}

export async function searchNearby({ lat, lng, category, keyword, radius = 5000 }) {
  const isTextSearch = keyword && !category

  if (isTextSearch) {
    const body = {
      textQuery: keyword,
      maxResultCount: 20,
      rankPreference: 'RELEVANCE',
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    }

    const res = await fetch(TEXT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': NEARBY_FIELDS,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Places API error: ${res.status}`)
    }

    const data = await res.json()
    return data.places || []
  }

  // Category / nearby search
  const body = {
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    },
    ...(category
      ? { includedTypes: Array.isArray(CATEGORY_TYPES[category])
            ? CATEGORY_TYPES[category]
            : [CATEGORY_TYPES[category]] }
      : { includedTypes: ['restaurant', 'cafe', 'car_repair',
                          'pharmacy', 'shopping_mall', 'tourist_attraction',
                          'museum', 'bowling_alley'] }),
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': NEARBY_FIELDS,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Places API error: ${res.status}`)
  }

  const data = await res.json()
  return data.places || []
}

export async function getPlaceDetails(placeId) {
  const res = await fetch(`${DETAILS_BASE}/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': DETAILS_FIELDS,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Places Details error: ${res.status}`)
  }

  return res.json()
}

// Build a photo URL from a Places API (New) photo resource name
export function getPhotoUrl(photoName, maxWidth = 400) {
  if (!photoName) return null
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`
}

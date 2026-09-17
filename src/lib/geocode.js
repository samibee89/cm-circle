const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

// Rough box around greater Chiang Mai (left,top,right,bottom) — biases
// results toward the area without excluding matches outside it.
const CHIANG_MAI_VIEWBOX = '98.6,19.1,99.3,18.5'

export async function searchAddress(query) {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    format: 'json',
    q: query,
    limit: '5',
    viewbox: CHIANG_MAI_VIEWBOX,
    'accept-language': 'en',
  })

  const response = await fetch(`${NOMINATIM_URL}?${params}`)
  if (!response.ok) throw new Error('Address search failed')
  return response.json()
}

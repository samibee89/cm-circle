import { useCallback, useState } from 'react'

// CartoDB (Positron/Voyager) — clean, minimal basemaps closer to the
// brand's soft aesthetic than OSM's default (busier, more saturated)
// styling. Uses Sami's CARTO account key, embedded per their own docs
// for client-side tile URLs (rate-limited/scoped on their end, not a
// secret like a database credential).
const CARTO_KEY = 'cb1_3oat_1_535cf09a715fe1243831c3af'

export const TILE_STYLES = {
  positron: {
    label: 'Positron',
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
  },
  voyager: {
    label: 'Voyager',
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
  },
}

export const TILE_SUBDOMAINS = 'abcd'
export const TILE_MAX_ZOOM = 20
// Required by CARTO's terms (carto.com/attributions) — keep visible.
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const STYLE_STORAGE_KEY = 'mapStyle'

function readStoredStyle() {
  const stored = localStorage.getItem(STYLE_STORAGE_KEY)
  return stored && TILE_STYLES[stored] ? stored : 'positron'
}

// Shared across every map on the page (main map + the add-place
// mini-map) so switching the style in one place is reflected everywhere,
// and persists across visits via localStorage.
export function useMapStyle() {
  const [style, setStyle] = useState(readStoredStyle)

  const toggleStyle = useCallback(() => {
    setStyle((current) => {
      const next = current === 'positron' ? 'voyager' : 'positron'
      localStorage.setItem(STYLE_STORAGE_KEY, next)
      return next
    })
  }, [])

  return [style, toggleStyle]
}

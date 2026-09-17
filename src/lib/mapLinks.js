// Google's documented cross-platform "Maps URL" format — opens the app on
// mobile if installed, falls back to Google Maps on the web otherwise.
export function googleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

// Apple's maps.apple.com URL scheme — works cross-platform, opens the
// Apple Maps app on iOS/macOS and a web preview elsewhere.
export function appleMapsUrl(lat, lng) {
  return `https://maps.apple.com/?ll=${lat},${lng}`
}

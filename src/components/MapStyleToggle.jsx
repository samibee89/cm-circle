import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { TILE_STYLES } from '../lib/mapTiles'

// Uses Leaflet's own control system (not a plain absolutely-positioned
// div) so it automatically stacks in the same "topleft" corner as the
// zoom buttons — Leaflet handles the layout, no manual pixel offsets to
// keep in sync if the zoom control's size ever changes.
export default function MapStyleToggle({ style, onToggle }) {
  const map = useMap()

  useEffect(() => {
    const nextStyle = style === 'positron' ? 'voyager' : 'positron'
    const control = L.control({ position: 'topleft' })

    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-bar map-style-toggle')
      const button = L.DomUtil.create('a', 'map-style-toggle-button', container)
      button.href = '#'
      button.textContent = TILE_STYLES[nextStyle].label
      button.title = `Switch to ${TILE_STYLES[nextStyle].label} style`

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.on(button, 'click', (e) => {
        L.DomEvent.preventDefault(e)
        onToggle()
      })

      return container
    }

    control.addTo(map)
    return () => control.remove()
  }, [map, style, onToggle])

  return null
}

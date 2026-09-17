import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

// Vite rewrites Leaflet's default marker image paths in a way that breaks them
// at build time — this re-points them at the bundled asset URLs instead.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const CHIANG_MAI_CENTER = [18.7883, 98.9853]

export default function MapView({ onSignOut }) {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <button
        type="button"
        onClick={onSignOut}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1000,
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          color: 'var(--color-white)',
          background: 'var(--gradient-primary)',
          border: 'none',
          borderRadius: 999,
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
      <MapContainer
        center={CHIANG_MAI_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={CHIANG_MAI_CENTER}>
          <Popup>Chiang Mai</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

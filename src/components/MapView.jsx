import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../lib/leafletIcons'
import 'leaflet/dist/leaflet.css'
import PlaceCard from './PlaceCard'

const CHIANG_MAI_CENTER = [18.7883, 98.9853]

export default function MapView({ places }) {
  return (
    <MapContainer
      center={CHIANG_MAI_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>
            <PlaceCard place={place} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

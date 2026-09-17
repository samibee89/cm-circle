import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../lib/leafletIcons'
import 'leaflet/dist/leaflet.css'
import PlaceCard from './PlaceCard'
import MapStyleToggle from './MapStyleToggle'
import './MapStyleToggle.css'
import { TILE_STYLES, TILE_ATTRIBUTION, TILE_SUBDOMAINS, TILE_MAX_ZOOM, useMapStyle } from '../lib/mapTiles'

const CHIANG_MAI_CENTER = [18.7883, 98.9853]

export default function MapView({ places }) {
  const [mapStyle, toggleMapStyle] = useMapStyle()

  return (
    <MapContainer
      center={CHIANG_MAI_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution={TILE_ATTRIBUTION}
        url={TILE_STYLES[mapStyle].url}
        subdomains={TILE_SUBDOMAINS}
        maxZoom={TILE_MAX_ZOOM}
      />
      <MapStyleToggle style={mapStyle} onToggle={toggleMapStyle} />
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

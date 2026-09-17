import { googleMapsUrl, appleMapsUrl } from '../lib/mapLinks'
import './PlaceCard.css'

export default function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <h3 className="place-card-name">{place.name}</h3>
      <p className="place-card-category">{place.category}</p>
      {place.note && <p className="place-card-note">{place.note}</p>}
      <p className="place-card-author">
        Added by {place.profiles?.display_name ?? 'Unknown'}
      </p>
      <div className="place-card-links">
        <a href={googleMapsUrl(place.lat, place.lng)} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
        <a href={appleMapsUrl(place.lat, place.lng)} target="_blank" rel="noreferrer">
          Open in Apple Maps
        </a>
      </div>
    </div>
  )
}

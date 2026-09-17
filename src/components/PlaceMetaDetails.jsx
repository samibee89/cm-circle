import { googleMapsUrl, appleMapsUrl } from '../lib/mapLinks'
import './PlaceCard.css'

export default function PlaceMetaDetails({ place }) {
  return (
    <>
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
    </>
  )
}

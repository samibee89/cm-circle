import PlaceMetaDetails from './PlaceMetaDetails'
import './PlaceCard.css'

export default function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <h3 className="place-card-name">{place.name}</h3>
      <p className="place-card-category">{place.category}</p>
      {place.note && <p className="place-card-note">{place.note}</p>}
      <PlaceMetaDetails place={place} />
    </div>
  )
}

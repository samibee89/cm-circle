import PlaceMetaDetails from './PlaceMetaDetails'
import CategoryBadges from './CategoryBadges'
import './PlaceCard.css'

export default function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <div className="place-card-header">
        <h3 className="place-card-name">{place.name}</h3>
        <CategoryBadges categories={place.category} />
      </div>
      {place.note && <p className="place-card-note">{place.note}</p>}
      <PlaceMetaDetails place={place} />
    </div>
  )
}

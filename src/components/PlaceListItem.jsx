import PlaceMetaDetails from './PlaceMetaDetails'
import CategoryBadges from './CategoryBadges'

export default function PlaceListItem({ place, expanded, onToggle }) {
  return (
    <div
      className={expanded ? 'place-list-card expanded' : 'place-list-card'}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="place-list-card-header">
        <h3 className="place-list-card-name">{place.name}</h3>
        <CategoryBadges categories={place.category} />
      </div>

      {place.note && (
        <p className={expanded ? 'place-list-card-note-full' : 'place-list-card-note-preview'}>
          {place.note}
        </p>
      )}

      {expanded && (
        <div className="place-list-card-details">
          <PlaceMetaDetails place={place} />
        </div>
      )}
    </div>
  )
}

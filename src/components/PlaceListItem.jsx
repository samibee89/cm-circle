import PlaceMetaDetails from './PlaceMetaDetails'

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
        <span className="place-list-card-category">{place.category}</span>
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

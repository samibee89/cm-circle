import PlaceCard from './PlaceCard'
import './PlaceList.css'

export default function PlaceList({ places }) {
  if (places.length === 0) {
    return <p className="place-list-empty">No places match these filters yet.</p>
  }

  return (
    <ul className="place-list">
      {places.map((place) => (
        <li key={place.id} className="place-list-item">
          <PlaceCard place={place} />
        </li>
      ))}
    </ul>
  )
}

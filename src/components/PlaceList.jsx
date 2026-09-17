import { useState } from 'react'
import PlaceListItem from './PlaceListItem'
import './PlaceList.css'

export default function PlaceList({ places }) {
  const [expandedId, setExpandedId] = useState(null)

  if (places.length === 0) {
    return <p className="place-list-empty">No places match these filters yet.</p>
  }

  return (
    <ul
      className="place-list"
      onClick={(e) => {
        // A click that reaches the <ul> itself (not a card) means the user
        // tapped the empty space around/between cards — collapse whatever
        // was open, matching "tap elsewhere to close."
        if (e.target === e.currentTarget) setExpandedId(null)
      }}
    >
      {places.map((place) => (
        <li key={place.id} className="place-list-item">
          <PlaceListItem
            place={place}
            expanded={expandedId === place.id}
            onToggle={() => setExpandedId((current) => (current === place.id ? null : place.id))}
          />
        </li>
      ))}
    </ul>
  )
}

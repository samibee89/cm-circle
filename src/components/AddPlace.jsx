import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import '../lib/leafletIcons'
import 'leaflet/dist/leaflet.css'
import { CATEGORIES } from '../lib/categories'
import { searchAddress } from '../lib/geocode'
import './AddPlace.css'

const CHIANG_MAI_CENTER = [18.7883, 98.9853]

// Lets clicking anywhere on the mini-map set the pin position.
function ClickToPlacePin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

// Recenters the mini-map whenever the pin position changes (from either a
// map click or picking an address search result).
function RecenterOnPosition({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16)
    }
  }, [position, map])
  return null
}

export default function AddPlace({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  const [note, setNote] = useState('')
  const [position, setPosition] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Debounce: only hit Nominatim ~500ms after typing pauses, not on every
  // keystroke — it's a shared free service, and firing a request per
  // keystroke would be both wasteful and rude.
  useEffect(() => {
    const trimmed = query.trim()

    const timeout = setTimeout(async () => {
      if (!trimmed) {
        setResults([])
        return
      }
      setSearching(true)
      try {
        const data = await searchAddress(trimmed)
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [query])

  function handleResultClick(result) {
    setPosition({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) })
    setResults([])
    setQuery(result.display_name)
    if (!name) setName(result.display_name.split(',')[0])
  }

  function toggleCategory(value) {
    setCategories((current) =>
      current.includes(value) ? current.filter((c) => c !== value) : [...current, value],
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!position) {
      setError('Drop a pin or search for an address first.')
      return
    }
    if (categories.length === 0) {
      setError('Select at least one category.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        name,
        category: categories,
        note: note || null,
        lat: position.lat,
        lng: position.lng,
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="add-place">
      <div className="add-place-header">
        <div>
          <p className="add-place-label">New place</p>
          <h1 className="add-place-heading gradient-text">Add to the journal</h1>
        </div>
        <button type="button" className="add-place-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <div className="add-place-search">
        <input
          type="text"
          placeholder="Search an address…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searching && <p className="add-place-hint">Searching…</p>}
        {results.length > 0 && (
          <ul className="add-place-results">
            {results.map((result) => (
              <li key={result.place_id}>
                <button type="button" onClick={() => handleResultClick(result)}>
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="add-place-hint">…or tap the map to drop a pin</p>

      <div className="add-place-map">
        <MapContainer
          center={CHIANG_MAI_CENTER}
          zoom={13}
          style={{ height: '220px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlacePin onPick={setPosition} />
          <RecenterOnPosition position={position} />
          {position && <Marker position={[position.lat, position.lng]} />}
        </MapContainer>
      </div>

      <form onSubmit={handleSubmit} className="add-place-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="add-place-category-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={
                categories.includes(c.value)
                  ? 'add-place-category-chip active'
                  : 'add-place-category-chip'
              }
              onClick={() => toggleCategory(c.value)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        {error && <p className="add-place-error">{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save place'}
        </button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import '../lib/leafletIcons'
import 'leaflet/dist/leaflet.css'
import { useCategories } from '../lib/CategoriesContext'
import { slugify } from '../lib/categoriesApi'
import { searchAddress } from '../lib/geocode'
import { TILE_STYLES, TILE_ATTRIBUTION, TILE_SUBDOMAINS, TILE_MAX_ZOOM, useMapStyle } from '../lib/mapTiles'
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
  const { categories, addCategory } = useCategories()
  // Reflects whichever style was last chosen via the main map's toggle —
  // this screen doesn't need its own toggle control.
  const [mapStyle] = useMapStyle()
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [note, setNote] = useState('')
  const [position, setPosition] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [newCategoryError, setNewCategoryError] = useState(null)

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
    setSelectedCategories((current) =>
      current.includes(value) ? current.filter((c) => c !== value) : [...current, value],
    )
  }

  async function handleCreateCategory(e) {
    e.preventDefault()
    setNewCategoryError(null)

    const label = newCategoryName.trim()
    const emoji = newCategoryEmoji.trim()
    if (!label) {
      setNewCategoryError('Give the category a name.')
      return
    }
    if (!emoji) {
      setNewCategoryError('Pick an emoji for it.')
      return
    }

    setCreatingCategory(true)
    try {
      const created = await addCategory({ value: slugify(label), label, emoji })
      setSelectedCategories((current) =>
        current.includes(created.value) ? current : [...current, created.value],
      )
      setNewCategoryName('')
      setNewCategoryEmoji('')
      setAddingCategory(false)
    } catch (err) {
      setNewCategoryError(err.message)
    } finally {
      setCreatingCategory(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!position) {
      setError('Drop a pin or search for an address first.')
      return
    }
    if (selectedCategories.length === 0) {
      setError('Select at least one category.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        name,
        category: selectedCategories,
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
            attribution={TILE_ATTRIBUTION}
            url={TILE_STYLES[mapStyle].url}
            subdomains={TILE_SUBDOMAINS}
            maxZoom={TILE_MAX_ZOOM}
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
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              className={
                selectedCategories.includes(c.value)
                  ? 'add-place-category-chip active'
                  : 'add-place-category-chip'
              }
              onClick={() => toggleCategory(c.value)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
          {!addingCategory && (
            <button
              type="button"
              className="add-place-category-chip add-place-category-new"
              onClick={() => setAddingCategory(true)}
            >
              + New category
            </button>
          )}
        </div>

        {addingCategory && (
          <div className="add-place-new-category">
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="text"
              placeholder="🎉"
              className="add-place-new-category-emoji"
              value={newCategoryEmoji}
              onChange={(e) => setNewCategoryEmoji(e.target.value)}
              maxLength={4}
            />
            <button
              type="button"
              className="add-place-new-category-save"
              onClick={handleCreateCategory}
              disabled={creatingCategory}
            >
              {creatingCategory ? 'Adding…' : 'Add'}
            </button>
            <button
              type="button"
              className="add-place-new-category-cancel"
              onClick={() => {
                setAddingCategory(false)
                setNewCategoryError(null)
              }}
            >
              Cancel
            </button>
            {newCategoryError && <p className="add-place-error">{newCategoryError}</p>}
          </div>
        )}

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

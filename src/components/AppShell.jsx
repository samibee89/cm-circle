import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { fetchPlaces, insertPlace } from '../lib/places'
import MapView from './MapView'
import PlaceList from './PlaceList'
import AddPlace from './AddPlace'
import Filters from './Filters'
import BottomNav from './BottomNav'
import Profile from './Profile'
import ZoomTip from './ZoomTip'
import { getInitials } from '../lib/initials'
import './AppShell.css'

export default function AppShell({ session }) {
  const [places, setPlaces] = useState([])
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'list' | 'add' | 'profile'
  const [categoryFilter, setCategoryFilter] = useState([]) // empty = no category filter
  const [authorFilter, setAuthorFilter] = useState('all')
  const displayName = session.user.user_metadata?.display_name ?? 'Unknown'
  // Header, filters, and bottom nav are all hidden on the two focused,
  // full-screen flows (Add, Profile) — this one flag keeps that condition
  // from being repeated three times with room to drift out of sync.
  const showChrome = activeTab === 'map' || activeTab === 'list'

  useEffect(() => {
    fetchPlaces().then(setPlaces).catch(console.error)
  }, [])

  // Filter options are derived from whoever has actually added a place —
  // no need for a separate query, and there's nothing to filter by for an
  // author with zero places anyway.
  const authors = useMemo(() => {
    const byId = new Map()
    places.forEach((place) => {
      if (place.created_by) {
        byId.set(place.created_by, place.profiles?.display_name ?? 'Unknown')
      }
    })
    return Array.from(byId, ([id, name]) => ({ id, name }))
  }, [places])

  // The single filtered array both the map and the list render from — this
  // is what keeps them in sync: neither view has its own filter logic.
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // A place matches if it has ANY of the selected categories, not all.
      if (categoryFilter.length > 0 && !place.category.some((c) => categoryFilter.includes(c))) {
        return false
      }
      if (authorFilter !== 'all' && place.created_by !== authorFilter) return false
      return true
    })
  }, [places, categoryFilter, authorFilter])

  async function handleAddPlace(formValues) {
    const newPlace = await insertPlace({ ...formValues, createdBy: session.user.id })
    setPlaces((prev) => [newPlace, ...prev])
    setActiveTab('map')
  }

  return (
    <div className="app-shell">
      <ZoomTip />

      {showChrome && (
        <header className="app-header">
          <div className="app-header-titles">
            <p className="app-header-label">Chiang Mai</p>
            <h1 className="app-header-title gradient-text">Women's Circle</h1>
          </div>
          <button
            type="button"
            className="app-header-avatar"
            onClick={() => setActiveTab('profile')}
            aria-label="Open profile"
          >
            {getInitials(displayName)}
          </button>
        </header>
      )}

      {showChrome && (
        <Filters
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          authorFilter={authorFilter}
          onAuthorChange={setAuthorFilter}
          authors={authors}
        />
      )}

      <main className="app-main">
        {activeTab === 'map' && (
          <div className="map-tab">
            <MapView places={filteredPlaces} />
            <button
              type="button"
              className="map-add-fab"
              onClick={() => setActiveTab('add')}
              aria-label="Add a place"
            >
              +
            </button>
          </div>
        )}
        {activeTab === 'list' && <PlaceList places={filteredPlaces} />}
        {activeTab === 'add' && (
          <AddPlace onSave={handleAddPlace} onCancel={() => setActiveTab('map')} />
        )}
        {activeTab === 'profile' && (
          <Profile
            displayName={displayName}
            onSignOut={() => supabase.auth.signOut()}
            onClose={() => setActiveTab('map')}
          />
        )}
      </main>

      {showChrome && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </div>
  )
}

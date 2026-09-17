import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { fetchPlaces, insertPlace } from '../lib/places'
import MapView from './MapView'
import PlaceList from './PlaceList'
import AddPlace from './AddPlace'
import Filters from './Filters'
import BottomNav from './BottomNav'
import './AppShell.css'

export default function AppShell({ session }) {
  const [places, setPlaces] = useState([])
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'list' | 'add'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [authorFilter, setAuthorFilter] = useState('all')

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
      if (categoryFilter !== 'all' && place.category !== categoryFilter) return false
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
      <header className="app-header">
        <span className="app-header-title">CM Circle</span>
        <button
          type="button"
          className="app-header-signout"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </header>

      {activeTab !== 'add' && (
        <Filters
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          authorFilter={authorFilter}
          onAuthorChange={setAuthorFilter}
          authors={authors}
        />
      )}

      <main className="app-main">
        {activeTab === 'map' && <MapView places={filteredPlaces} />}
        {activeTab === 'list' && <PlaceList places={filteredPlaces} />}
        {activeTab === 'add' && (
          <AddPlace onSave={handleAddPlace} onCancel={() => setActiveTab('map')} />
        )}
      </main>

      {activeTab !== 'add' && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </div>
  )
}

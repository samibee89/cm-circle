import './BottomNav.css'

function MapPinIcon({ filled }) {
  if (filled) {
    // Same glyph as the app icon itself, for a bit of brand consistency.
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function ListIcon({ filled }) {
  if (filled) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="5" width="18" height="3" rx="1.5" />
        <rect x="3" y="10.5" width="18" height="3" rx="1.5" />
        <rect x="3" y="16" width="18" height="3" rx="1.5" />
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={activeTab === 'map' ? 'nav-tab active' : 'nav-tab'}
        onClick={() => onChange('map')}
      >
        <MapPinIcon filled={activeTab === 'map'} />
        <span>Map</span>
      </button>

      <button
        type="button"
        className={activeTab === 'list' ? 'nav-tab active' : 'nav-tab'}
        onClick={() => onChange('list')}
      >
        <ListIcon filled={activeTab === 'list'} />
        <span>List</span>
      </button>
    </nav>
  )
}

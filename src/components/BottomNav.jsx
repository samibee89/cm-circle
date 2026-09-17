import './BottomNav.css'

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={activeTab === 'map' ? 'nav-tab active' : 'nav-tab'}
        onClick={() => onChange('map')}
      >
        Map
      </button>

      <button
        type="button"
        className="nav-add-fab"
        onClick={() => onChange('add')}
        aria-label="Add a place"
      >
        +
      </button>

      <button
        type="button"
        className={activeTab === 'list' ? 'nav-tab active' : 'nav-tab'}
        onClick={() => onChange('list')}
      >
        List
      </button>
    </nav>
  )
}

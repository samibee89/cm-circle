import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import './Filters.css'

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export default function Filters({
  categoryFilter,
  onCategoryChange,
  authorFilter,
  onAuthorChange,
  authors,
}) {
  const [open, setOpen] = useState(false)

  const activeCount = (categoryFilter !== 'all' ? 1 : 0) + (authorFilter !== 'all' ? 1 : 0)

  return (
    <>
      <div className="filters-bar">
        <button type="button" className="filters-trigger" onClick={() => setOpen(true)}>
          Filters
          {activeCount > 0 && <span className="filters-badge">{activeCount}</span>}
        </button>
      </div>

      {open && (
        <div className="filters-sheet-backdrop" onClick={() => setOpen(false)}>
          <div className="filters-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="filters-sheet-handle" />
            <h2 className="filters-sheet-heading gradient-text">Filters</h2>

            <p className="filters-sheet-label">Category</p>
            <div className="filters-chip-row">
              <button
                type="button"
                className={categoryFilter === 'all' ? 'filters-chip active' : 'filters-chip'}
                onClick={() => onCategoryChange('all')}
              >
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={categoryFilter === category ? 'filters-chip active' : 'filters-chip'}
                  onClick={() => onCategoryChange(category)}
                >
                  {capitalize(category)}
                </button>
              ))}
            </div>

            <p className="filters-sheet-label">Added by</p>
            <div className="filters-list">
              <button
                type="button"
                className={authorFilter === 'all' ? 'filters-list-row active' : 'filters-list-row'}
                onClick={() => onAuthorChange('all')}
              >
                Everyone
              </button>
              {authors.map((author) => (
                <button
                  key={author.id}
                  type="button"
                  className={authorFilter === author.id ? 'filters-list-row active' : 'filters-list-row'}
                  onClick={() => onAuthorChange(author.id)}
                >
                  {author.name}
                </button>
              ))}
            </div>

            <button type="button" className="filters-sheet-done" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}

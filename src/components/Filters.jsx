import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import './Filters.css'

export default function Filters({
  categoryFilter,
  onCategoryChange,
  authorFilter,
  onAuthorChange,
  authors,
}) {
  const [open, setOpen] = useState(false)

  const activeCount = categoryFilter.length + (authorFilter !== 'all' ? 1 : 0)

  function toggleCategory(value) {
    onCategoryChange(
      categoryFilter.includes(value)
        ? categoryFilter.filter((c) => c !== value)
        : [...categoryFilter, value],
    )
  }

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

            <p className="filters-sheet-label">Category (matches any selected)</p>
            <div className="filters-chip-row">
              <button
                type="button"
                className={categoryFilter.length === 0 ? 'filters-chip active' : 'filters-chip'}
                onClick={() => onCategoryChange([])}
              >
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={
                    categoryFilter.includes(category.value) ? 'filters-chip active' : 'filters-chip'
                  }
                  onClick={() => toggleCategory(category.value)}
                >
                  {category.emoji} {category.label}
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

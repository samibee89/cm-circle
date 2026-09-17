import { useState } from 'react'
import { useCategories } from '../lib/CategoriesContext'
import './Filters.css'

export default function Filters({
  categoryFilter,
  onCategoryChange,
  authorFilter,
  onAuthorChange,
  authors,
}) {
  const [open, setOpen] = useState(false)
  const { categories } = useCategories()

  const activeCount = categoryFilter.length + authorFilter.length

  function toggleCategory(value) {
    onCategoryChange(
      categoryFilter.includes(value)
        ? categoryFilter.filter((c) => c !== value)
        : [...categoryFilter, value],
    )
  }

  function toggleAuthor(id) {
    onAuthorChange(
      authorFilter.includes(id) ? authorFilter.filter((a) => a !== id) : [...authorFilter, id],
    )
  }

  function clearAll() {
    onCategoryChange([])
    onAuthorChange([])
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
            <div className="filters-sheet-heading-row">
              <h2 className="filters-sheet-heading gradient-text">Filters</h2>
              {activeCount > 0 && (
                <button type="button" className="filters-clear" onClick={clearAll}>
                  Clear filters
                </button>
              )}
            </div>

            <p className="filters-sheet-label">Category (matches any selected)</p>
            <div className="filters-chip-row">
              <button
                type="button"
                className={categoryFilter.length === 0 ? 'filters-chip active' : 'filters-chip'}
                onClick={() => onCategoryChange([])}
              >
                All
              </button>
              {categories.map((category) => (
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

            <p className="filters-sheet-label">Added by (matches any selected)</p>
            <div className="filters-chip-row">
              <button
                type="button"
                className={authorFilter.length === 0 ? 'filters-chip active' : 'filters-chip'}
                onClick={() => onAuthorChange([])}
              >
                Everyone
              </button>
              {authors.map((author) => (
                <button
                  key={author.id}
                  type="button"
                  className={authorFilter.includes(author.id) ? 'filters-chip active' : 'filters-chip'}
                  onClick={() => toggleAuthor(author.id)}
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

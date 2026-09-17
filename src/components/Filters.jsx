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
  return (
    <div className="filters">
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {capitalize(category)}
          </option>
        ))}
      </select>

      <select
        value={authorFilter}
        onChange={(e) => onAuthorChange(e.target.value)}
        aria-label="Filter by who added it"
      >
        <option value="all">Everyone</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </select>
    </div>
  )
}

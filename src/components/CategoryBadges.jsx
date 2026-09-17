import { getCategoryEmoji } from '../lib/categories'

export default function CategoryBadges({ categories }) {
  return (
    <span className="category-badges">
      {categories.map((category) => (
        <span key={category} className="category-badge" title={category}>
          {getCategoryEmoji(category)}
        </span>
      ))}
    </span>
  )
}

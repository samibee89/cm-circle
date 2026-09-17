import { useCategories } from '../lib/CategoriesContext'

export default function CategoryBadges({ categories }) {
  const { categories: allCategories } = useCategories()
  const emojiByValue = new Map(allCategories.map((c) => [c.value, c.emoji]))

  return (
    <span className="category-badges">
      {categories.map((category) => (
        <span key={category} className="category-badge" title={category}>
          {emojiByValue.get(category) ?? '📍'}
        </span>
      ))}
    </span>
  )
}

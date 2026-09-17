export const CATEGORIES = [
  { value: 'coffee', label: 'Coffee', emoji: '☕' },
  { value: 'food', label: 'Food', emoji: '🍽️' },
  { value: 'coworking', label: 'Coworking', emoji: '💻' },
  { value: 'nature', label: 'Nature', emoji: '🌳' },
  { value: 'gym', label: 'Gym', emoji: '🏋️' },
  { value: 'hiking', label: 'Hiking', emoji: '🥾' },
  { value: 'dog-friendly', label: 'Dog Friendly', emoji: '🐾' },
  { value: 'kid-friendly', label: 'Kid Friendly', emoji: '🧒' },
]

const EMOJI_BY_VALUE = new Map(CATEGORIES.map((c) => [c.value, c.emoji]))

export function getCategoryEmoji(value) {
  return EMOJI_BY_VALUE.get(value) ?? '📍'
}

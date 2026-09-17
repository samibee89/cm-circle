import { supabase } from './supabaseClient'

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function insertCategory({ value, label, emoji }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ value, label, emoji })
    .select()
    .single()

  if (error) {
    // Someone already added a category with this same slug (e.g. both
    // people typed "Yoga" around the same time) — reuse the existing row
    // rather than erroring, since conceptually it's the same category.
    if (error.code === '23505') {
      const { data: existing, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('value', value)
        .single()
      if (fetchError) throw fetchError
      return existing
    }
    throw error
  }

  return data
}

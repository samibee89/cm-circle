import { supabase } from './supabaseClient'

export async function fetchPlaces() {
  const { data, error } = await supabase
    .from('places')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function insertPlace({ name, category, lat, lng, note, createdBy }) {
  const { data, error } = await supabase
    .from('places')
    .insert({ name, category, lat, lng, note, created_by: createdBy })
    .select('*, profiles(display_name)')
    .single()

  if (error) throw error
  return data
}

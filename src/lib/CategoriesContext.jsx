import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchCategories, insertCategory } from './categoriesApi'

const CategoriesContext = createContext(null)

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  const addCategory = useCallback(async (newCategory) => {
    const created = await insertCategory(newCategory)
    setCategories((prev) =>
      prev.some((c) => c.value === created.value) ? prev : [...prev, created],
    )
    return created
  }, [])

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider')
  }
  return context
}

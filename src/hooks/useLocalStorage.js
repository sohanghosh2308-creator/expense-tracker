import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedItem = localStorage.getItem(key)
      if (storedItem !== null) {
        return JSON.parse(storedItem)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}

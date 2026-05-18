import { useState, useEffect, useCallback } from 'react'

export interface GalleryItem {
  id: string
  date: number
  dataUrl: string // full strip image
}

const DB_NAME = 'PhotoboothDB'
const STORE_NAME = 'gallery'

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

const getGallery = async (): Promise<GalleryItem[]> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

const saveItem = async (item: GalleryItem): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(item)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

const deleteItem = async (id: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadItems = useCallback(async () => {
    try {
      const stored = await getGallery()
      if (stored) {
        setItems(stored.sort((a, b) => b.date - a.date))
      }
    } catch (e) {
      console.error('Failed to load gallery', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const saveToGallery = async (dataUrl: string) => {
    try {
      const newItem: GalleryItem = {
        id: Math.random().toString(36).substr(2, 9),
        date: Date.now(),
        dataUrl,
      }
      await saveItem(newItem)
      const stored = await getGallery()
      const sorted = stored.sort((a, b) => b.date - a.date)
      setItems(sorted)
      return true
    } catch (e) {
      console.error('Failed to save to gallery', e)
      return false
    }
  }

  const deleteFromGallery = async (id: string) => {
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (e) {
      console.error('Failed to delete from gallery', e)
    }
  }

  return { items, isLoading, saveToGallery, deleteFromGallery }
}

"use client"

import { useState, useEffect } from "react"

interface Shortcut {
  id: string
  name: string
  url: string
  category: string
  iconUrl: string
  customIcon?: string
}

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const savedShortcuts = localStorage.getItem("shortcuts")
    if (savedShortcuts) {
      setShortcuts(JSON.parse(savedShortcuts))
    }
  }, [])

  const saveShortcuts = (newShortcuts: Shortcut[]) => {
    setShortcuts(newShortcuts)
    localStorage.setItem("shortcuts", JSON.stringify(newShortcuts))
  }

  const addShortcut = (shortcutData: any) => {
    const newShortcut = {
      id: shortcutData.id || Math.random().toString(36).substring(7), // Preserve ID if exists in import
      ...shortcutData,
      createdAt: shortcutData.createdAt || new Date().toISOString(),
    }

    setShortcuts(prev => [...prev, newShortcut])
    localStorage.setItem("shortcuts", JSON.stringify([...shortcuts, newShortcut]))
  }

  const importShortcuts = (importedShortcuts: Shortcut[]) => {
    setShortcuts(importedShortcuts)
    localStorage.setItem("shortcuts", JSON.stringify(importedShortcuts))
  }

  const deleteShortcut = (id: string) => {
    saveShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id))
  }

  const editShortcut = (id: string, updatedShortcut: Omit<Shortcut, "id">) => {
    saveShortcuts(
      shortcuts.map((shortcut) =>
        shortcut.id === id ? { ...updatedShortcut, id } : shortcut
      )
    )
  }

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesSearch = shortcut.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || shortcut.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return {
    shortcuts: filteredShortcuts,
    addShortcut,
    deleteShortcut,
    editShortcut,
    importShortcuts,
    setSearchQuery,
    setSelectedCategory,
  }
}


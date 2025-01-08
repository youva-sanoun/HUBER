"use client"

import { useState, useEffect } from "react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  date: string
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem("notes", JSON.stringify(newNotes))
  }

  const addNote = (note: Omit<Note, "id" | "date">) => {
    const newNote = {
      ...note,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
    }
    saveNotes([...notes, newNote])
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((note) => note.id !== id))
  }

  const editNote = (id: string, updatedNote: Omit<Note, "id" | "date">) => {
    saveNotes(
      notes.map((note) =>
        note.id === id ? { ...note, ...updatedNote, date: new Date().toISOString() } : note
      )
    )
  }

  return {
    notes,
    addNote,
    deleteNote,
    editNote,
  }
}


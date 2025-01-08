"use client"

import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface NoteViewerProps {
  note: {
    title: string
    content: string
    category: string
    date: string
  }
  onClose: () => void
}

export function NoteViewer({ note, onClose }: NoteViewerProps) {
  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="h-full flex flex-col">
        <header className="border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{note.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{note.category}</span>
                <span>•</span>
                <span>{new Date(note.date).toLocaleDateString()}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto prose dark:prose-invert max-w-4xl">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </main>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Note } from "@/types/note"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash, MoreVertical } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

function transformContent(content: string): string {
  return content.split('\n').map(line => {
    if (line.startsWith('- ')) {
      return `• ${line.slice(2)}`;
    }
    if (line.startsWith('# ')) {
      return `<h1 class="text-2xl font-bold my-2">${line.slice(2)}</h1>`;
    }
    if (line.startsWith('## ')) {
      return `<h2 class="text-xl font-semibold my-2">${line.slice(3)}</h2>`;
    }
    if (line.startsWith('| ')) {
      return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">${line.slice(2)}</blockquote>`;
    }
    if (line.startsWith('$$ ')) {
      return `<code class="bg-secondary px-2 py-1 rounded font-mono text-sm">${line.slice(3)}</code>`;
    }
    return line;
  }).join('\n');
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "personal" as Note["category"],
  });
  const [isPreview, setIsPreview] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title || "Untitled",
      content: newNote.content,
      category: newNote.category,
      date: new Date().toISOString(),
    };
    
    saveNotes([...notes, note]);
    setIsCreating(false);
    setNewNote({ title: "", content: "", category: "personal" });
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
  };

  const renderContent = (content: string) => (
    <div dangerouslySetInnerHTML={{ __html: transformContent(content) }} />
  );

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, isEditing: boolean) => {
    const value = e.target.value;
    if (isEditing && editingNote) {
      setEditingNote({
        ...editingNote,
        content: value
      });
    } else {
      setNewNote(prev => ({
        ...prev,
        content: value
      }));
    }
  };

  const SyntaxHelper = () => (
    <div className="mb-2 text-sm text-muted-foreground">
      <span className="block mb-1">Supported syntax:</span>
      <code className="text-xs bg-secondary px-1 py-0.5 rounded mr-2">- text</code> for bullet points
      <code className="text-xs bg-secondary px-1 py-0.5 rounded mr-2"># text</code> for titles
      <code className="text-xs bg-secondary px-1 py-0.5 rounded mr-2">## text</code> for subtitles
      <code className="text-xs bg-secondary px-1 py-0.5 rounded mr-2">| text</code> for quotes
      <code className="text-xs bg-secondary px-1 py-0.5 rounded">$$ text</code> for code
    </div>
  );

  const NoteContent = ({ content }: { content: string }) => {
    if (isPreview) {
      return (
        <div className="flex-1 overflow-y-auto px-4">
          {renderContent(content)}
        </div>
      );
    }

    return (
      <Textarea
        placeholder="Start writing your note here..."
        value={content}
        onChange={(e) => handleTextareaChange(e, !!editingNote)}
        className="flex-1 min-h-[400px] resize-none focus-visible:ring-0 text-base leading-relaxed"
      />
    );
  };

  const EditorToolbar = () => (
    <div className="flex items-center justify-between mb-4 px-4">
      <SyntaxHelper />
      <div className="flex items-center gap-2">
        <Label htmlFor="preview-mode">Preview</Label>
        <Switch
          id="preview-mode"
          checked={isPreview}
          onCheckedChange={setIsPreview}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card 
            key={note.id} 
            className="flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleEditNote(note)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{note.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {renderContent(note.content)}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="secondary">{note.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(note.date).toLocaleDateString()}
              </span>
            </CardFooter>
          </Card>
        ))}
        <Card 
          className="flex items-center justify-center cursor-pointer" 
          onClick={() => setIsCreating(true)}
        >
          <CardContent>
            <Plus className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 font-medium">Add Note</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl h-[80vh] p-6">
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 flex-1 mt-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold focus-visible:ring-0"
              />
              <Select
                value={newNote.category}
                onValueChange={(value) => setNewNote(prev => ({ ...prev, category: value as Note["category"] }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="ideas">Ideas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col">
              <EditorToolbar />
              <NoteContent content={newNote.content} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-1 bg-secondary rounded text-xs">Esc</kbd> to cancel
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateNote}>Save Note</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => {
          setEditingNote(null);
          setIsPreview(false);
        }}>
          <DialogContent className="max-w-4xl h-[80vh] p-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Edit Note</DialogTitle>
                <span className="text-sm text-muted-foreground">
                  {new Date(editingNote.date).toLocaleDateString()}
                </span>
              </div>
            </DialogHeader>
            <div className="flex flex-col gap-4 flex-1 mt-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Note title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({
                    ...editingNote,
                    title: e.target.value
                  })}
                  className="text-lg font-semibold focus-visible:ring-0"
                />
                <Select
                  value={editingNote.category}
                  onValueChange={(value) => setEditingNote({
                    ...editingNote,
                    category: value as Note["category"]
                  })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="ideas">Ideas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col">
                <EditorToolbar />
                <NoteContent content={editingNote.content} />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-secondary rounded text-xs">Esc</kbd> to close
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
                <Button onClick={() => handleUpdateNote(editingNote)}>Update Note</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}


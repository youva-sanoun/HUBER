"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteEditor } from "./note-editor";

function transformContent(content: string): string {
  return content
    .split("\n")
    .map((line) => {
      if (line.startsWith("- ")) {
        return `• ${line.slice(2)}`;
      }
      if (line.startsWith("# ")) {
        return `<h1 class="text-2xl font-bold my-2">${line.slice(2)}</h1>`;
      }
      if (line.startsWith("## ")) {
        return `<h2 class="text-xl font-semibold my-2">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("| ")) {
        return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">${line.slice(
          2
        )}</blockquote>`;
      }
      if (line.startsWith("$$ ")) {
        return `<code class="bg-secondary px-2 py-1 rounded font-mono text-sm">${line.slice(
          3
        )}</code>`;
      }
      return line;
    })
    .join("\n");
}

function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.slice(0, maxLength) + "...";
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

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = (note: Note) => {
    saveNotes([...notes, note]);
    setIsCreating(false);
    setNewNote({ title: "", content: "", category: "personal" });
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
  };

  const renderContent = (content: string) => (
    <div dangerouslySetInnerHTML={{ __html: transformContent(content) }} />
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
              {renderContent(truncateContent(note.content, 200))}
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

      {/* Create Note Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-6xl h-[90vh] p-6">
          <NoteEditor
            note={newNote}
            onClose={() => setIsCreating(false)}
            onSave={handleCreateNote}
            isCreating={true}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className="max-w-6xl h-[90vh] p-6">
            <NoteEditor
              note={editingNote}
              onClose={() => setEditingNote(null)}
              onSave={handleUpdateNote}
              isCreating={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

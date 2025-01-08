"use client"

import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export function NoteEditor({ note, onClose, onSave }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note>(note);

  const handleChange = (field: keyof Note, value: string) => {
    const updatedNote = {
      ...editedNote,
      [field]: value,
    };
    setEditedNote(updatedNote);
    onSave(updatedNote);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col gap-4">
        <DialogHeader>
          <Input
            value={editedNote.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="text-xl font-semibold focus-visible:ring-0"
            placeholder="Note title..."
          />
          <Select
            value={editedNote.category}
            onValueChange={(value) => handleChange("category", value as Note["category"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="ideas">Ideas</SelectItem>
            </SelectContent>
          </Select>
        </DialogHeader>
        <div className="flex-1">
          <Textarea
            value={editedNote.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="h-full resize-none focus-visible:ring-0"
            placeholder="Start writing..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

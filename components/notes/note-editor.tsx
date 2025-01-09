"use client";

import { useState, useRef, useEffect } from "react";
import { Note } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { marked } from "marked";
import { CommandPalette } from "./command-palette";

interface NoteEditorProps {
  note: Partial<Note>;
  onClose: () => void;
  onSave: (note: Note) => void;
  isCreating: boolean;
}

export function NoteEditor({
  note,
  onClose,
  onSave,
  isCreating,
}: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Partial<Note>>(note);
  const [isPreview, setIsPreview] = useState(!isCreating);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (field: keyof Note, value: string) => {
    setEditedNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (editedNote.title && editedNote.content && editedNote.category) {
      onSave(editedNote as Note);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "!" && e.ctrlKey) || (e.key === "/" && e.ctrlKey)) {
      e.preventDefault();
      setShowCommandPalette(true);
    }
  };

  const handleCommandSelect = (command: string) => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      const newValue =
        editedNote.content?.slice(0, selectionStart) +
        command +
        editedNote.content?.slice(selectionEnd);
      handleChange("content", newValue || "");
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          selectionStart + command.length,
          selectionStart + command.length
        );
      }, 0);
    }
  };

  const renderContent = (content: string) => {
    const markdown = content
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
    return { __html: marked(markdown) };
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-row gap-4">
        <div className="w-1/4 p-4 border-r border-muted flex flex-col justify-between bg-background">
          <div>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {note.id ? "Edit Note" : "New Note"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Use Ctrl + ! or Ctrl + /
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mt-4">
              <Label htmlFor="preview-mode">Preview</Label>
              <Switch
                id="preview-mode"
                checked={isPreview}
                onCheckedChange={setIsPreview}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col gap-2">
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full">
              Save Note
            </Button>
          </DialogFooter>
        </div>
        <div className="flex-1 flex flex-col gap-4 p-4">
          {isPreview ? (
            <div className="flex-1 overflow-y-auto px-4 border border-muted rounded-md p-4">
              <h1 className="text-2xl font-bold mb-4">
                {editedNote.title || "Untitled"}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{editedNote.category}</Badge>
                {editedNote.date && (
                  <span className="text-sm text-muted-foreground">
                    {new Date(editedNote.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={renderContent(
                    editedNote.content || ""
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Note title"
                  value={editedNote.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-lg font-semibold focus-visible:ring-0"
                />
                <Select
                  value={editedNote.category || "personal"}
                  onValueChange={(value) =>
                    handleChange("category", value as Note["category"])
                  }
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
              <Textarea
                ref={textareaRef}
                placeholder="Start writing your note here..."
                value={editedNote.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-h-[400px] resize-none text-base leading-relaxed"
              />
            </div>
          )}
          {showCommandPalette && (
            <CommandPalette
              onSelect={handleCommandSelect}
              onClose={() => setShowCommandPalette(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

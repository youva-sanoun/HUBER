"use client";

import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  defaultDropAnimation,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import {
  Plus,
  ExternalLink,
  MoreVertical,
  Search,
  Download,
  Upload,
} from "lucide-react";
import { ShortcutDialog } from "./shortcut-dialog";
import { useShortcuts } from "@/hooks/use-shortcuts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraggableShortcutCard } from "./draggable-shortcut-card";

const DropPlaceholder = () => (
  <div className="absolute inset-0 rounded-lg border-2 border-primary border-dashed bg-primary/5 pointer-events-none" />
);

export function Shortcuts() {
  const [open, setOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const {
    shortcuts,
    addShortcut,
    deleteShortcut,
    editShortcut,
    setSearchQuery,
    setSelectedCategory,
    importShortcuts,
  } = useShortcuts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start dragging after moving 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation = {
    ...defaultDropAnimation,
    duration: 200, // Faster animation
  };

  const handleEdit = (shortcut: any) => {
    setEditingShortcut(shortcut);
    setOpen(true);
  };

  const handleSave = (shortcutData: any) => {
    if (editingShortcut) {
      editShortcut(editingShortcut.id, shortcutData);
      setEditingShortcut(null);
    } else {
      addShortcut(shortcutData);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingShortcut(null);
    }
  };

  const handleCardClick = (e: React.MouseEvent, url: string) => {
    // Prevent click when clicking dropdown menu
    if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
      return;
    }
    window.open(url, "_blank");
  };

  const handleExportShortcuts = () => {
    const dataStr = JSON.stringify(shortcuts, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shortcuts.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportShortcuts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedShortcuts = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedShortcuts)) {
            // Replace existing shortcuts with imported ones
            importShortcuts(importedShortcuts);
          }
        } catch (error) {
          console.error("Error importing shortcuts:", error);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overIndex = shortcuts.findIndex((s) => s.id === over.id);
      setOverIndex(overIndex);
    } else {
      setOverIndex(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setOverIndex(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = shortcuts.findIndex((s) => s.id === active.id);
      const newIndex = shortcuts.findIndex((s) => s.id === over.id);
      const newShortcuts = arrayMove(shortcuts, oldIndex, newIndex);
      importShortcuts(newShortcuts);
    }
  };

  const activeShortcut = shortcuts.find((s) => s.id === activeId);

  return (
    <div className="max-w-[1600px] mx-auto">
      <Header />
      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-3xl mx-auto pt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search shortcuts..."
            className="pl-9"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          onValueChange={(value) =>
            setSelectedCategory(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportShortcuts}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleExportShortcuts}
            title="Export shortcuts"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Import shortcuts"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shortcut
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[]}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          <SortableContext items={shortcuts} strategy={rectSortingStrategy}>
            {shortcuts.map((shortcut, index) => (
              <div key={shortcut.id} className="relative">
                <DraggableShortcutCard
                  shortcut={shortcut}
                  onEdit={handleEdit}
                  onDelete={deleteShortcut}
                  onCardClick={handleCardClick}
                />
                {overIndex === index && <DropPlaceholder />}
              </div>
            ))}
          </SortableContext>
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeShortcut ? (
            <div className="opacity-80">
              <DraggableShortcutCard
                shortcut={activeShortcut}
                onEdit={handleEdit}
                onDelete={deleteShortcut}
                onCardClick={handleCardClick}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <ShortcutDialog
        open={open}
        onOpenChange={handleOpenChange}
        onSave={handleSave}
        shortcut={editingShortcut}
      />
    </div>
  );
}

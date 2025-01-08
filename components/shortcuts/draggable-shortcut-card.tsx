import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DraggableShortcutCardProps {
  shortcut: any;
  onEdit: (shortcut: any) => void;
  onDelete: (id: string) => void;
  onCardClick: (e: React.MouseEvent, url: string) => void;
}

export function DraggableShortcutCard({
  shortcut,
  onEdit,
  onDelete,
  onCardClick,
}: DraggableShortcutCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shortcut.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? 1.05 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden hover:shadow-md transition-all duration-200 border hover:border-primary/20
        ${isDragging ? "opacity-50 cursor-grabbing shadow-lg" : "cursor-grab"}
      `}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-0">
        <div
          className="cursor-pointer"
          onClick={(e) => onCardClick(e, shortcut.url)}
        >
          <div className="relative aspect-[2/1.2] bg-secondary/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <img
              src={shortcut.customIcon || shortcut.iconUrl}
              alt={shortcut.name}
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-200" />
          </div>
          <div className="p-3 pb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate text-sm mb-1.5">
                {shortcut.name}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate bg-secondary/50 w-fit px-2 py-0.5 rounded-full">
                {shortcut.category}
              </p>
            </div>
          </div>
        </div>
        <div className="px-3 pb-2 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="dropdown-trigger h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(shortcut)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(shortcut.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

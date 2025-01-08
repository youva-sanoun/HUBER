"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (todo: { 
    title: string
    description: string
    category: string
    pomodoroWork: number
    pomodoroBreak: number
    priority: string
    tags: string[]
  }) => void
  todo?: any
}

export function TodoDialog({
  open,
  onOpenChange,
  onSave,
  todo,
}: TodoDialogProps) {
  const [title, setTitle] = useState(todo?.title || "")
  const [description, setDescription] = useState(todo?.description || "")
  const [category, setCategory] = useState(todo?.category || "work")
  const [pomodoroWork, setPomodoroWork] = useState(todo?.pomodoroWork || 25)
  const [pomodoroBreak, setPomodoroBreak] = useState(todo?.pomodoroBreak || 5)
  const [priority, setPriority] = useState(todo?.priority || "low")
  const [tags, setTags] = useState(todo?.tags?.join(", ") || "")

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description)
      setCategory(todo.category)
      setPomodoroWork(todo.pomodoroWork || 25)
      setPomodoroBreak(todo.pomodoroBreak || 5)
      setPriority(todo.priority || "low")
      setTags(todo.tags?.join(", ") || "")
    }
  }, [todo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description,
      category,
      pomodoroWork,
      pomodoroBreak,
      priority,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
    })
    setTitle("")
    setDescription("")
    setCategory("work")
    setPomodoroWork(25)
    setPomodoroBreak(5)
    setPriority("low")
    setTags("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Complete project presentation"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task details here..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pomodoroWork">Work Duration (min)</Label>
              <Input
                id="pomodoroWork"
                type="number"
                min="1"
                value={pomodoroWork}
                onChange={(e) => setPomodoroWork(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pomodoroBreak">Break Duration (min)</Label>
              <Input
                id="pomodoroBreak"
                type="number"
                min="1"
                value={pomodoroBreak}
                onChange={(e) => setPomodoroBreak(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, presentation, important"
            />
          </div>
          <DialogFooter>
            <Button type="submit">{todo ? "Save Changes" : "Add Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


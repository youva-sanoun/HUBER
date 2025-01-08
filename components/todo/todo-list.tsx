"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Timer, Edit2, Trash, MoreVertical } from 'lucide-react'
import { TodoDialog } from "./todo-dialog"
import { useTodos } from "@/hooks/use-todos"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PomodoroDialog } from "./pomodoro-dialog"

export function TodoList() {
  const [open, setOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<any>(null)
  const [pomodoroTodo, setPomodoroTodo] = useState<any>(null)
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos()

  const handleEdit = (todo: any) => {
    setEditingTodo(todo)
    setOpen(true)
  }

  const handleSave = (todoData: any) => {
    if (editingTodo) {
      editTodo(editingTodo.id, todoData)
      setEditingTodo(null)
    } else {
      addTodo(todoData)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setEditingTodo(null)
    }
  }

  const startPomodoro = (todo: any) => {
    setPomodoroTodo(todo)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos.length}</div>
            <p className="text-xs text-muted-foreground">
              {todos.filter((todo) => todo.completed).length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todos.filter((todo) => todo.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              +10.1% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card key={todo.id}>
            <CardContent className="p-4 flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <div>
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{todo.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary">{todo.category}</Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startPomodoro(todo)}>
                    <Timer className="mr-2 h-4 w-4" />
                    Start Timer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(todo)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
      <TodoDialog 
        open={open} 
        onOpenChange={handleOpenChange} 
        onSave={handleSave}
        todo={editingTodo}
      />
      {pomodoroTodo && (
        <PomodoroDialog
          open={!!pomodoroTodo}
          onOpenChange={(open) => !open && setPomodoroTodo(null)}
          workDuration={pomodoroTodo.pomodoroWork || 25}
          breakDuration={pomodoroTodo.pomodoroBreak || 5}
          taskTitle={pomodoroTodo.title}
        />
      )}
    </>
  )
}


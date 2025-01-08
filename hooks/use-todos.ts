"use client"

import { useState, useEffect } from "react"

interface Todo {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const addTodo = (todo: Omit<Todo, "id" | "completed">) => {
    const newTodo = {
      ...todo,
      id: Math.random().toString(36).substring(7),
      completed: false,
    }
    saveTodos([...todos, newTodo])
  }

  const toggleTodo = (id: string) => {
    saveTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: string, updatedTodo: Omit<Todo, "id" | "completed">) => {
    saveTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    )
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  }
}


import { TodoList } from "@/components/todo/todo-list"
import { PageHeader } from "@/components/page-header"

export default function TodoPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Todo List"
        description="Manage your tasks and stay organized."
      />
      <TodoList />
    </div>
  )
}


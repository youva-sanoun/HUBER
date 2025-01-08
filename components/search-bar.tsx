import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
}

export function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}


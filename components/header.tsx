"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(
        search
      )}`;
      window.open(url, "_blank");
    }
  };

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search Google..."
              className="px-9 py-6 w-full bg-secondary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
    </header>
  );
}

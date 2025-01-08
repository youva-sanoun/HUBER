"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid, ListTodo, StickyNote, Bot, Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const routes = [
  {
    label: "Shortcuts",
    icon: Grid,
    href: "/",
  },
  {
    label: "Todo",
    icon: ListTodo,
    href: "/todo",
  },
  {
    label: "Notes",
    icon: StickyNote,
    href: "/notes",
  },
  {
    label: "AI Chat",
    icon: Bot,
    href: "/chat",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 h-full w-64 p-4 bg-background border-r flex flex-col justify-between">
      <nav className="flex flex-col space-y-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3",
                pathname === route.href && "bg-secondary"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
      <div className="flex w-full justify-evenly items-center">
        <ModeToggle />
        <Link key="/settings" href="/settings">
          <Button
            variant="outline"
            size="icon"
            className={cn(pathname === "/settings" && "bg-secondary")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

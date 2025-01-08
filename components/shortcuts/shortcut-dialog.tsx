"use client"

import { useState, useRef, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShortcutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (shortcut: { name: string; url: string; category: string; iconUrl: string; customIcon?: string }) => void
  shortcut?: { id: string; name: string; url: string; category: string; iconUrl: string; customIcon?: string }
}

const protocols = ["https://", "http://", "file:///"]

export function ShortcutDialog({
  open,
  onOpenChange,
  onSave,
  shortcut,
}: ShortcutDialogProps) {
  const [name, setName] = useState(shortcut?.name || "")
  const [url, setUrl] = useState(shortcut?.url || "")
  const [protocol, setProtocol] = useState("https://")
  const [category, setCategory] = useState(shortcut?.category || "work")
  const [useCustomIcon, setUseCustomIcon] = useState(!!shortcut?.customIcon)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [customIcon, setCustomIcon] = useState<string | undefined>(shortcut?.customIcon)

  useEffect(() => {
    if (shortcut) {
      setName(shortcut.name)
      setUrl(shortcut.url)
      setCategory(shortcut.category)
      setUseCustomIcon(!!shortcut.customIcon)
      setCustomIcon(shortcut.customIcon)

      const urlProtocol = shortcut.url.match(/^(https?:\/\/|file:\/\/\/)/)?.[0] || "https://"
      setProtocol(urlProtocol)
      setUrl(shortcut.url.replace(urlProtocol, ""))
    }
  }, [shortcut])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomIcon(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullUrl = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file:///")
      ? url
      : `${protocol}${url}`
    
    onSave({
      name,
      url: fullUrl,
      category,
      iconUrl: `https://www.google.com/s2/favicons?domain=${fullUrl}&sz=64`,
      customIcon: useCustomIcon ? customIcon : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shortcut ? "Edit Shortcut" : "Add New Shortcut"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Google"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Select value={protocol} onValueChange={setProtocol}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Protocol" />
                </SelectTrigger>
                <SelectContent>
                  {protocols.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="google.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomIcon"
                checked={useCustomIcon}
                onChange={(e) => setUseCustomIcon(e.target.checked)}
              />
              <Label htmlFor="useCustomIcon">Use custom icon</Label>
            </div>
            {useCustomIcon && (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Icon
                </Button>
                {customIcon && (
                  <img src={customIcon} alt="Custom icon" className="w-8 h-8" />
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">{shortcut ? "Save Changes" : "Add Shortcut"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


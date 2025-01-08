"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    mistralai: "",
    anthropic: "",
    gemini: "",
    deepseek: "",
  })

  useEffect(() => {
    const savedKeys = localStorage.getItem("aiApiKeys")
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }
  }, [])

  const handleSave = (provider: string, key: string) => {
    const newKeys = { ...apiKeys, [provider]: key }
    setApiKeys(newKeys)
    localStorage.setItem("aiApiKeys", JSON.stringify(newKeys))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your API keys and preferences."
      />
      <Card>
        <CardHeader>
          <CardTitle>AI API Keys</CardTitle>
          <CardDescription>
            Configure your API keys for different AI providers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openai"
                type="password"
                value={apiKeys.openai}
                onChange={(e) => handleSave("openai", e.target.value)}
                placeholder="sk-..."
              />
              <Button
                variant="outline"
                onClick={() => handleSave("openai", "")}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mistralai">MistralAI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="mistralai"
                type="password"
                value={apiKeys.mistralai}
                onChange={(e) => handleSave("mistralai", e.target.value)}
                placeholder="..."
              />
              <Button
                variant="outline"
                onClick={() => handleSave("mistralai", "")}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="anthropic">Anthropic API Key (Claude)</Label>
            <div className="flex gap-2">
              <Input
                id="anthropic"
                type="password"
                value={apiKeys.anthropic}
                onChange={(e) => handleSave("anthropic", e.target.value)}
                placeholder="..."
              />
              <Button
                variant="outline"
                onClick={() => handleSave("anthropic", "")}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gemini">Google API Key (Gemini)</Label>
            <div className="flex gap-2">
              <Input
                id="gemini"
                type="password"
                value={apiKeys.gemini}
                onChange={(e) => handleSave("gemini", e.target.value)}
                placeholder="..."
              />
              <Button
                variant="outline"
                onClick={() => handleSave("gemini", "")}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deepseek">DeepSeek API Key</Label>
            <div className="flex gap-2">
              <Input
                id="deepseek"
                type="password"
                value={apiKeys.deepseek}
                onChange={(e) => handleSave("deepseek", e.target.value)}
                placeholder="..."
              />
              <Button
                variant="outline"
                onClick={() => handleSave("deepseek", "")}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


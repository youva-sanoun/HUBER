"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "./chat-message";

const AI_PROVIDERS = {
  openai: {
    name: "GPT-4",
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4-turbo-preview",
  },
  mistralai: {
    name: "Mistral",
    url: "https://api.mistral.ai/v1/chat/completions",
    model: "mistral-large-latest",
  },
  anthropic: {
    name: "Claude",
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-3-opus-20240229",
  },
  gemini: {
    name: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    model: "gemini-pro",
  },
  deepseek: {
    name: "DeepSeek",
    url: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
  },
};

export function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState("openai");
  const { toast } = useToast();

  useEffect(() => {
    // Clear messages when switching providers
    setMessages([]);
  }, [provider]);

  const getApiKey = () => {
    const keys = JSON.parse(localStorage.getItem("aiApiKeys") || "{}");
    return keys[provider];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: `Please add your ${AI_PROVIDERS[provider].name} API key in settings.`,
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      let response;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      switch (provider) {
        case "openai":
        case "mistralai":
        case "deepseek":
          response = await fetch(AI_PROVIDERS[provider].url, {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: AI_PROVIDERS[provider].model,
              messages: [...messages, userMessage],
            }),
          });
          const data = await response.json();
          const content = data.choices[0].message.content;
          setMessages((prev) => [...prev, { role: "assistant", content }]);
          break;

        case "anthropic":
          response = await fetch(AI_PROVIDERS[provider].url, {
            method: "POST",
            headers: {
              ...headers,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: AI_PROVIDERS[provider].model,
              messages: [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
              })),
            }),
          });
          const claudeData = await response.json();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: claudeData.content[0].text },
          ]);
          break;

        case "gemini":
          response = await fetch(
            `${AI_PROVIDERS[provider].url}?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: input }],
                  },
                ],
              }),
            }
          );
          const geminiData = await response.json();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: geminiData.candidates[0].content.parts[0].text,
            },
          ]);
          break;
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full  mx-auto">
      <Select value={provider} onValueChange={setProvider}>
        <SelectTrigger>
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">GPT-4</SelectItem>
          <SelectItem value="mistralai">Mistral AI</SelectItem>
          <SelectItem value="anthropic">Claude</SelectItem>
          <SelectItem value="gemini">Gemini</SelectItem>
          <SelectItem value="deepseek">DeepSeek</SelectItem>
        </SelectContent>
      </Select>
      <div className="mb-4"></div>
      <CardContent className="p-6 w-full">
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex space-x-2 items-center">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

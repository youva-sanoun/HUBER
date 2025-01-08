import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client'; // Add this import
import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  ListIcon,
  TextIcon,
  QuoteIcon,
  ListOrderedIcon,
} from 'lucide-react';

export interface SuggestionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: any }) => void;
}

export const createCommandList = () => {
  let portal: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  const CommandList = ({ 
    items, 
    command,
    clientRect,
  }: { 
    items: SuggestionItem[],
    command: (item: SuggestionItem) => void,
    clientRect: DOMRect,
  }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // Position the menu
      wrapper.style.position = 'absolute';
      wrapper.style.left = `${clientRect.x}px`;
      wrapper.style.top = `${clientRect.y + clientRect.height}px`;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % items.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          command(items[selectedIndex]);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [items, selectedIndex, command, clientRect]);

    return createPortal(
      <div 
        ref={wrapperRef}
        className="z-50 p-2 max-h-[300px] w-[300px] overflow-y-auto rounded-lg border bg-popover shadow-md"
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground 
              ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => command(item)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </button>
        ))}
      </div>,
      document.body
    );
  };

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect; items: SuggestionItem[] }) => {
      portal = document.createElement('div');
      document.body.append(portal);

      cleanup = () => {
        portal?.remove();
        portal = null;
      };

      const onCommand = (item: SuggestionItem) => {
        item.command(props);
        cleanup?.();
      };

      const root = createRoot(portal);
      root.render(
        <CommandList
          items={props.items}
          command={onCommand}
          clientRect={props.clientRect}
        />
      );
    },
    onUpdate: (props: { clientRect: DOMRect }) => {
      // Position updates are handled by the component
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      // Key events are handled by the component
      return false;
    },
    onExit: () => {
      cleanup?.();
    },
  };
}

// ...existing commandItems array...
export const commandItems = [
  {
    title: 'Text',
    description: 'Regular text block',
    icon: <TextIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1Icon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2Icon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a bulleted list',
    icon: <ListIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <ListOrderedIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote Block',
    description: 'Create a blockquote',
    icon: <QuoteIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code Block',
    description: 'Insert code snippet',
    icon: <CodeIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
];

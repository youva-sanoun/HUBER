import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextIcon, Heading1Icon, Heading2Icon, ListIcon, QuoteIcon, CodeIcon } from 'lucide-react';

interface CommandPaletteProps {
  onSelect: (command: string) => void;
  onClose: () => void;
}

const commands = [
  { label: 'Bullet List', symbol: '- ', icon: <ListIcon className="h-4 w-4" /> },
  { label: 'Big Title', symbol: '# ', icon: <Heading1Icon className="h-4 w-4" /> },
  { label: 'Small Title', symbol: '## ', icon: <Heading2Icon className="h-4 w-4" /> },
  { label: 'Quote', symbol: '| ', icon: <QuoteIcon className="h-4 w-4" /> },
  { label: 'Code Block', symbol: '$$ ', icon: <CodeIcon className="h-4 w-4" /> },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + commands.length) % commands.length);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % commands.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(commands[selectedIndex].symbol);
        onClose();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  return createPortal(
    <div
      ref={wrapperRef}
      className="fixed z-50 p-2 max-h-[300px] w-[300px] overflow-y-auto rounded-lg border bg-popover shadow-md"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {commands.map((command, index) => (
        <button
          key={index}
          className={`w-full flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground 
            ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => {
            onSelect(command.symbol);
            onClose();
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md border">
            {command.icon}
          </div>
          <div>
            <p className="font-medium">{command.label}</p>
          </div>
        </button>
      ))}
    </div>,
    document.body
  );
};

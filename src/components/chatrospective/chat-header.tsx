"use client";

import { useState, useEffect } from 'react';
import { MessageSquareText, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ChatHeader() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="py-6 border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquareText className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
            Chatrospective
          </h1>
        </div>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-foreground hover:text-primary"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

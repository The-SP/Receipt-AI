'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-0 h-auto w-auto bg-transparent hover:bg-transparent cursor-pointer"
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

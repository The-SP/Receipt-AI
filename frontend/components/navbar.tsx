import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Receipt className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Receipt AI</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
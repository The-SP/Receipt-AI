import Link from 'next/link';
import { Receipt } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Receipt className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Receipt AI</span>
          </Link>

          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radar, FileText, Home, Menu, X, ScanLine } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/scan', label: 'New Scan', icon: ScanLine },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const linkClass = (href: string) => {
    if (isLanding) {
      return pathname === href
        ? 'text-white bg-white/10'
        : 'text-white/70 hover:text-white hover:bg-white/10';
    }
    return pathname === href
      ? 'text-[#1a1a2e] bg-[#f0ede8]'
      : 'text-gray-500 hover:text-[#1a1a2e] hover:bg-[#f0ede8]';
  };

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${isLanding ? 'bg-[#1a1a2e]/90 border-[#c8a45e]/20' : 'bg-white/90 border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLanding ? 'bg-[#c8a45e]' : 'bg-[#1a1a2e]'}`}>
              <Radar className="w-5 h-5 text-white" />
            </div>
            <span className={`font-semibold text-base sm:text-lg tracking-tight ${isLanding ? 'text-white' : 'text-[#1a1a2e]'}`}>
              Majlis Radar
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${linkClass(link.href)}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`sm:hidden p-2 rounded-lg transition-colors cursor-pointer ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-[#1a1a2e] hover:bg-[#f0ede8]'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className={`sm:hidden border-t ${isLanding ? 'bg-[#1a1a2e] border-[#c8a45e]/20' : 'bg-white border-border'}`}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${linkClass(link.href)}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

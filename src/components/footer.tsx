'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Landing page has its own footer
  if (pathname === '/') return null;

  return (
    <footer className="py-4 text-center">
      <p className="text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Majlis Radar. All rights reserved.
      </p>
    </footer>
  );
}

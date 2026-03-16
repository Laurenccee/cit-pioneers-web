'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { LogOut, Menu } from 'lucide-react';
import type { Role } from '@/features/auth/services/userService';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'News', href: '/news' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Faculty', href: '/faculty' },
  { label: 'About', href: '/about' },
];

export default function NavigationTab({
  studentId,
  email,
  role,
  onClick,
}: {
  studentId?: string;
  email?: string;
  role?: Role;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center rounded-md justify-center bg-primary font-oswald text-xl font-bold text-primary-foreground">
            P
          </div>
          <span className="text-2xl tracking-tight text-foreground">
            Pioneers CIT
          </span>
        </div>
        <div>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 text-base font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'underline text-primary'
                      : 'hover:underline hover:text-primary text-muted-foreground'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {role === 'admin' && (
              <Link
                href="/students"
                className={`flex items-center gap-1.5 px-4 text-base font-medium whitespace-nowrap transition-colors ${
                  pathname === '/students'
                    ? 'underline text-primary'
                    : 'hover:underline hover:text-primary text-muted-foreground'
                }`}
              >
                Students
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {studentId || email || role ? (
            <>
              <span className="hidden text-base text-muted-foreground sm:block">
                {studentId ? `ID: ${studentId}` : email}
              </span>
              <Button className="h-10 px-4 font-oswald gap-2" onClick={onClick}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="h-10 px-8 font-oswald">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import NavigationTab from '@/components/layout/navigationTab';
import NavigationLoading from '@/components/layout/navLoading';
import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, profile, loadingProfile, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingProfile && profile?.mustChangePassword) {
      router.replace('/change-password');
    }
  }, [loadingProfile, profile, router]);

  const handleSignOut = async () => {
    await signOut();
  };
  if (loading || loadingProfile) {
    return <NavigationLoading />;
  }
  return (
    <>
      <header className="sticky top-0 z-10">
        <NavigationTab
          studentId={profile?.studentId}
          email={profile?.email}
          role={profile?.role}
          onClick={handleSignOut}
        />
      </header>
      {children}
    </>
  );
}

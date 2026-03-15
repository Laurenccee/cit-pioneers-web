'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileSetupForm from '@/features/profile/components/ProfileSetupForm';

export default function ProfileSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/sign-in');
      } else if (!user.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  if (!user.emailVerified) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ProfileSetupForm />
    </div>
  );
}

'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileSetupForm from '@/features/profile/components/ProfileSetupForm';
import SetupProfileLoading from './loading';

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
    return <SetupProfileLoading />;
  }

  if (!user.emailVerified) {
    return <SetupProfileLoading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ProfileSetupForm />
    </div>
  );
}

'use client';

import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const { user, loading } = useAuthContext();

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    loading,
    signOut,
  };
}

export function useRequireAuth(redirectUrl = '/sign-in') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  return { user, loading };
}

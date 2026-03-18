'use client';

import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const { user, loading, profile, loadingProfile, isAdmin, refreshProfile } =
    useAuthContext();

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
    profile,
    loadingProfile,
    isAdmin,
    signOut,
    refreshProfile,
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

export function useRequireAdmin(redirectUrl = '/home') {
  const { user, loading, isAdmin, loadingProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in/admin');
      return;
    }
    if (!loading && !loadingProfile && !isAdmin) {
      router.push(redirectUrl);
    }
  }, [user, loading, isAdmin, loadingProfile, router, redirectUrl]);

  return { user, loading: loading || loadingProfile, isAdmin };
}

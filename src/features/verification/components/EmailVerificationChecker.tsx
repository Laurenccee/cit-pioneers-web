'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/services/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { Loader, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function EmailVerificationChecker() {
  const { user } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!user || hasRedirected.current) return;

    const handleVerified = () => {
      if (hasRedirected.current) return;

      hasRedirected.current = true;

      toast.success('Email verified!', {
        description: 'Redirecting to profile setup...',
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      // Small delay for toast visibility
      setTimeout(() => {
        router.push('/setup-profile');
      }, 500);
    };

    // Listen for real-time token changes (includes email verification)
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (!currentUser || hasRedirected.current) return;

      try {
        // Reload to get the latest verification status
        await currentUser.reload();

        const updatedUser = auth.currentUser;

        if (updatedUser?.emailVerified) {
          handleVerified();
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    });

    // Also poll every 5 seconds as a fallback
    const pollInterval = setInterval(async () => {
      if (!auth.currentUser || hasRedirected.current) return;

      try {
        await auth.currentUser.reload();
        const updatedUser = auth.currentUser;

        if (updatedUser?.emailVerified) {
          handleVerified();
        }
      } catch (error) {
        console.error('Error in polling verification:', error);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [user, router]);

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Loader className="h-4 w-4 animate-spin text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Checking verification status...
          </p>
          <p className="text-xs text-muted-foreground">
            We'll redirect you automatically once verified
          </p>
        </div>
      </div>
    </div>
  );
}

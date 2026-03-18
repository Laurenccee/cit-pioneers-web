'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { updateMustChangePassword } from '../services/userService';
import { useAuth } from './useAuth';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../schemas/authSchemas';

export function useChangePassword() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete && profile && !profile.mustChangePassword) {
      router.replace('/home');
    }
  }, [isComplete, profile, router]);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onError = () => {
    const firstError = Object.values(form.formState.errors)[0];
    if (firstError?.message) toast.error(firstError.message as string);
  };

  const onSubmit = (data: ChangePasswordFormData) => {
    startTransition(async () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !user) return;

      try {
        const credential = EmailAuthProvider.credential(
          currentUser.email!,
          data.currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, data.newPassword);
        // Force token refresh — Firebase invalidates the old token after password change
        await currentUser.getIdToken(true);
        await updateMustChangePassword(user.uid, false);
        await refreshProfile();
        toast.success('Password changed successfully!');
        setIsComplete(true);
      } catch (error: any) {
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          toast.error('Current password is incorrect.');
        } else if (error.code === 'auth/requires-recent-login') {
          toast.error('Session expired. Please sign in again.');
          router.push('/sign-in');
        } else {
          toast.error(error.message ?? 'Failed to change password.');
        }
      }
    });
  };

  return {
    form,
    isPending,
    onSubmit,
    onError,
  };
}

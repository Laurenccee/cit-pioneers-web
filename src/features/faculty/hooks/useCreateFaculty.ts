'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createFacultySchema,
  type CreateFacultyFormData,
} from '../schemas/facultySchemas';
import { createFacultyAuthAction } from '../actions/createFacultyAction';
import { createFacultyAccount } from '../services/facultyService';

interface UseCreateFacultyOptions {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function useCreateFaculty({
  onSuccess,
  onClose,
}: UseCreateFacultyOptions = {}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateFacultyFormData>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      facultyId: '',
      rank: '',
      designation: '',
      assignedCourses: [],
      education: [],
    },
  });

  const onSubmit = (data: CreateFacultyFormData) => {
    startTransition(async () => {
      const result = await createFacultyAuthAction(data.email);
      // Default password is P@$$W0rd; faculty must change it on first login
      if (result.error || !result.uid) {
        toast.error(result.error ?? 'Failed to create user account.', {
          className: 'destructive',
        });
        return;
      }

      try {
        console.log('Creating faculty profile with UID:', result.uid);
        await createFacultyAccount(
          result.uid,
          data.email,
          data.firstName,
          data.lastName,
          data.facultyId,
          data.rank,
          data.designation || '',
          data.assignedCourses || [],
          data.education,
          true,
        );
        toast.success(
          `${data.firstName} ${data.lastName} has been added successfully.`,
        );
        form.reset();
        onClose?.();
        onSuccess?.();
      } catch (error: any) {
        console.error('Error creating faculty profile:', error);
        toast.error(error?.message ?? 'Failed to create faculty profile.', {
          className: 'destructive',
        });
      }
    });
  };

  const onError = () => {
    const firstError = Object.values(form.formState.errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message as string, { className: 'destructive' });
    }
  };

  return {
    form,
    isPending,
    onSubmit,
    onError,
  };
}

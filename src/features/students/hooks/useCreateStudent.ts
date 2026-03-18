'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createStudentSchema,
  type CreateStudentFormData,
} from '../schemas/studentSchemas';
import { createStudentAuthAction } from '../actions/createStudentAction';
import { createStudentAccount } from '../services/studentService';
import { majorsByCourse, allMajors } from '@/lib/data/academicOptions';

interface UseCreateStudentOptions {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function useCreateStudent({
  onSuccess,
  onClose,
}: UseCreateStudentOptions = {}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      studentId: '',
      course: '',
      major: '',
      year: '',
      section: '',
    },
  });

  const selectedCourse = form.watch('course');
  const availableMajors = selectedCourse
    ? (majorsByCourse[selectedCourse] ?? [])
    : allMajors;

  const onSubmit = (data: CreateStudentFormData) => {
    startTransition(async () => {
      const result = await createStudentAuthAction(data.studentId);
      // Default password is P@$$W0rd; student must change it on first login

      if (result.error || !result.uid) {
        toast.error(result.error ?? 'Failed to create user account.', {
          className: 'destructive',
        });
        return;
      }

      try {
        await createStudentAccount(
          result.uid,
          data.firstName,
          data.lastName,
          data.studentId,
          data.course,
          data.major,
          parseInt(data.year),
          data.section,
          true,
        );
        toast.success(
          `${data.firstName} ${data.lastName} has been added successfully.`,
        );
        form.reset();
        onClose?.();
        onSuccess?.();
      } catch (error: any) {
        toast.error(error?.message ?? 'Failed to create student profile.', {
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
    availableMajors,
    onSubmit,
    onError,
  };
}

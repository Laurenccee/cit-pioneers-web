// src/features/auth/schemas/authSchemas.ts
import { z } from 'zod';

export const studentSignInSchema = z.object({
  studentId: z
    .string()
    .length(6, 'Student ID must be 6 digits')
    .regex(/^\d+$/, 'Student ID must contain only numbers'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminSignInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/** @deprecated Use studentSignInSchema or adminSignInSchema */
export const signInSchema = studentSignInSchema;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

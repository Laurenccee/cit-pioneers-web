import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  studentId: z
    .string()
    .length(6, 'Student ID must be 6 digits')
    .regex(/^\d+$/, 'Student ID must contain only numbers'),
  course: z.string().min(2, 'Course is required'),
  major: z.string().min(2, 'Major is required'),
  year: z
    .string()
    .min(1, 'Please select a year level')
    .refine((val) => ['1', '2', '3', '4'].includes(val), {
      message: 'Please select a valid year level',
    }),
  section: z.string().min(1, 'Section is required'),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

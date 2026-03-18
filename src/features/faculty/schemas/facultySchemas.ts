import { z } from 'zod';

export const createFacultySchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  facultyId: z
    .string()
    .length(3, 'Faculty ID must be 3 digits')
    .regex(/^\d+$/, 'Faculty ID must contain only numbers'),
  rank: z.string().min(2, 'Position must be at least 2 characters'),
  designation: z.string().optional(),
  assignedCourses: z.array(z.string()).optional(),
  education: z
    .array(
      z.object({
        level: z.string().min(1, 'Level is required'),
        degree: z.string().min(1, 'Degree is required'),
        yearGraduated: z.string(),
        onGoing: z.boolean(),
      }),
    )
    .min(1, 'At least one degree must be specified'),
});

export type CreateFacultyFormData = z.infer<typeof createFacultySchema>;

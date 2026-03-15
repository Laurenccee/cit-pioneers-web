'use server';

import { profileSetupSchema } from '@/features/profile/schemas/profileSchemas';
import { studentIdExists } from '@/lib/firestore';

export async function profileSetupAction(formData: unknown) {
  try {
    // Validate input
    const validatedFields = profileSetupSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: 'Invalid data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { studentId } = validatedFields.data;

    // Check if student ID already exists
    const studentExists = await studentIdExists(studentId);
    if (studentExists) {
      return {
        error: 'This Student ID is already in use',
      };
    }

    // Return data for client-side Firestore creation
    return {
      success: true,
      data: validatedFields.data,
    };
  } catch (error: any) {
    console.error('Profile setup error:', error);
    return {
      error: 'Something went wrong. Please try again.',
    };
  }
}

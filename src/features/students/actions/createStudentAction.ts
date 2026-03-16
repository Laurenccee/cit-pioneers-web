'use server';

import { adminAuth } from '@/lib/firebase/admin';

interface CreateStudentResult {
  uid?: string;
  error?: string;
}

export async function createStudentAuthAction(
  email: string,
  password: string,
): Promise<CreateStudentResult> {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    });
    return { uid: userRecord.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'A user with this email already exists.' };
    }
    return { error: error.message ?? 'Failed to create user account.' };
  }
}

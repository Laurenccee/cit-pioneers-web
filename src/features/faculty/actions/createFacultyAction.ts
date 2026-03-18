'use server';

import { adminAuth } from '@/lib/firebase/admin';
import { uuid } from 'zod';

interface CreateStudentResult {
  uid?: string;
  error?: string;
}

export async function createFacultyAuthAction(
  email: string,
): Promise<CreateStudentResult> {
  try {
    console.log('Creating faculty account with email:', email);
    const userRecord = await adminAuth.createUser({
      email,
      password: 'P@s$W0rd',
      emailVerified: true,
    });
    return { uid: userRecord.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'A faculty member with this email already exists.' };
    }
    return { error: error.message ?? 'Failed to create user account.' };
  }
}

'use server';

import { adminAuth } from '@/lib/firebase/admin';

interface CreateStudentResult {
  uid?: string;
  error?: string;
}

export async function createStudentAuthAction(
  studentId: string,
): Promise<CreateStudentResult> {
  try {
    const syntheticEmail = `${studentId}@pioneers.local`;
    const userRecord = await adminAuth.createUser({
      email: syntheticEmail,
      password: 'P@$$W0rd',
      emailVerified: true,
    });
    return { uid: userRecord.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'A student with this ID already exists.' };
    }
    return { error: error.message ?? 'Failed to create user account.' };
  }
}

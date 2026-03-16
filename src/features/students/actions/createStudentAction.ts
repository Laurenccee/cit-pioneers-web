'use server';

interface CreateStudentResult {
  uid?: string;
  error?: string;
}

export async function createStudentAuthAction(
  email: string,
  password: string,
): Promise<CreateStudentResult> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: false }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      const code: string = data?.error?.message ?? '';
      if (code === 'EMAIL_EXISTS') {
        return { error: 'A user with this email already exists.' };
      }
      return { error: code || 'Failed to create user account.' };
    }
    return { uid: data.localId };
  } catch (error: any) {
    return { error: error.message ?? 'Failed to create user account.' };
  }
}

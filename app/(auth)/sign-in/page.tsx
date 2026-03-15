import SignInForm from '@/features/auth/components/SignInForm';
import React from 'react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-background  sm:items-start">
        <SignInForm />
      </main>
    </div>
  );
}

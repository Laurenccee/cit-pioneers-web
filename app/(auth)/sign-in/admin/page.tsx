import AdminSignInForm from '@/features/auth/components/AdminSignInForm';
import React from 'react';

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 sm:items-start">
        <AdminSignInForm />
      </main>
    </div>
  );
}

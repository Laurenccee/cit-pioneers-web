'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, Loader } from 'lucide-react';
import { EmailVerificationChecker } from '@/features/verification/components/EmailVerificationChecker';
import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'sonner';
import VerifyEmailLoading from './loading';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  const handleResendEmail = async () => {
    if (!user) return;

    setResending(true);
    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent!', {
        description: 'Please check your inbox.',
      });
    } catch (error: any) {
      console.error('Error resending email:', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Failed to send verification email');
      }
    } finally {
      setResending(false);
    }
  };

  if (loading || !user) {
    return <VerifyEmailLoading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to{' '}
            <span className="font-medium text-foreground">{user.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-checking verification status */}
          <EmailVerificationChecker />

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Next Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>You'll be automatically redirected!</li>
            </ol>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Automatic Detection:</strong> Once you verify your email,
              we'll automatically detect it and redirect you to complete your
              profile.
            </p>
            <p>
              <strong>Didn't receive the email?</strong> Check your spam folder
              or click the button below to resend.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleResendEmail}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
            {resending ? (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

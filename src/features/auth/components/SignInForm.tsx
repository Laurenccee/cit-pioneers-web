'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowRight,
  Eye,
  EyeClosed,
  Loader,
  Mail,
  RectangleEllipsis,
} from 'lucide-react';
import { signInSchema } from '../schemas/authSchemas';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { z } from 'zod';

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Check for verification success
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully!', {
        description: 'You can now sign in to access your dashboard.',
      });
    }
  }, [searchParams]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    startTransition(async () => {
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('@/services/firebase');

        await signInWithEmailAndPassword(auth, data.email, data.password);

        toast.success('Signed in successfully!');
        router.push('/dashboard');
        router.refresh();
      } catch (error: any) {
        console.error('Firebase sign in error:', error);
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-credential'
        ) {
          toast.error('Invalid email or password');
        } else {
          toast.error('Failed to sign in. Please try again.');
        }
      }
    });
  };

  const onError = () => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl">SIGN IN</CardTitle>
        <CardDescription>Sign in with your email and password</CardDescription>
      </CardHeader>
      <form id="signin-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={isPending}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                </InputGroup>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <RectangleEllipsis />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={isPending}
                    autoComplete="off"
                    aria-invalid={!!errors.password}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      tabIndex={-1}
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon-sm"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              )}
            />
          </div>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          size="lg"
          type="submit"
          form="signin-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Signing In...' : 'Sign In'}
          {isPending ? <Loader className="animate-spin" /> : <ArrowRight />}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

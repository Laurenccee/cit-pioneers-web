'use client';

import { useState, useTransition } from 'react';
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
  Hash,
  Loader,
  RectangleEllipsis,
} from 'lucide-react';
import { studentSignInSchema } from '../schemas/authSchemas';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

type SignInFormData = z.infer<typeof studentSignInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(studentSignInSchema),
    defaultValues: {
      studentId: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    startTransition(async () => {
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');

        const syntheticEmail = `${data.studentId}@pioneers.local`;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          syntheticEmail,
          data.password,
        );

        const { getUserProfile } =
          await import('@/features/auth/services/userService');
        const profile = await getUserProfile(userCredential.user.uid);

        toast.success('Signed in successfully!');
        if (profile?.mustChangePassword) {
          router.push('/change-password');
        } else {
          router.push('/home');
        }
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
    <Card className="w-full font-serif max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign in with your Student ID and password
        </CardDescription>
      </CardHeader>
      <form id="signin-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <Hash />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="studentId"
                    type="text"
                    placeholder="Enter your Student ID"
                    maxLength={6}
                    disabled={isPending}
                    autoComplete="username"
                    aria-invalid={!!errors.studentId}
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
          variant="default"
          size="lg"
          type="submit"
          form="signin-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Signing In...' : 'Sign In'}
          {isPending ? <Loader className="animate-spin" /> : <ArrowRight />}
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
import { signUpSchema } from '@/features/auth/schemas/authSchemas';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeClosed, Mail, RectangleEllipsis } from 'lucide-react';
import { toast } from 'sonner';

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    startTransition(async () => {
      // Create Firebase Auth user directly
      try {
        const { createUserWithEmailAndPassword, sendEmailVerification } =
          await import('firebase/auth');
        const { auth } = await import('@/services/firebase');

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );

        // Send email verification
        await sendEmailVerification(userCredential.user);

        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.',
        });

        router.push('/verify-email');
        router.refresh();
      } catch (error: any) {
        console.error('Firebase sign up error:', error);

        if (error.code === 'auth/email-already-in-use') {
          toast.error('This email is already registered');
        } else if (error.code === 'auth/weak-password') {
          toast.error('Password is too weak');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email address');
        } else {
          toast.error('Failed to create account. Please try again.');
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up with your email and password</CardDescription>
      </CardHeader>
      <form id="signup-form" onSubmit={handleSubmit(onSubmit, onError)}>
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
                    placeholder="Create a password"
                    disabled={isPending}
                    autoComplete="of"
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <RectangleEllipsis />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    disabled={isPending}
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      tabIndex={-1}
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="icon-sm"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? <Eye /> : <EyeClosed />}
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
          form="signup-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

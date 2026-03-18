'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useChangePassword } from '@/features/auth';
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
  Eye,
  EyeClosed,
  KeyRound,
  Loader,
  RectangleEllipsis,
} from 'lucide-react';

export default function ChangePasswordPage() {
  const { form, isPending, onSubmit, onError } = useChangePassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>
            Your account uses a default password. Please set a new password
            before continuing.
          </CardDescription>
        </CardHeader>
        <form
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <KeyRound />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Your current password"
                      disabled={isPending}
                      autoComplete="current-password"
                      aria-invalid={!!errors.currentPassword}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        tabIndex={-1}
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowCurrent(!showCurrent)}
                        aria-label={
                          showCurrent ? 'Hide password' : 'Show password'
                        }
                      >
                        {showCurrent ? <Eye /> : <EyeClosed />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <RectangleEllipsis />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="newPassword"
                      type={showNew ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      disabled={isPending}
                      autoComplete="new-password"
                      aria-invalid={!!errors.newPassword}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        tabIndex={-1}
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowNew(!showNew)}
                        aria-label={showNew ? 'Hide password' : 'Show password'}
                      >
                        {showNew ? <Eye /> : <EyeClosed />}
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
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      disabled={isPending}
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        tabIndex={-1}
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={
                          showConfirm ? 'Hide password' : 'Show password'
                        }
                      >
                        {showConfirm ? <Eye /> : <EyeClosed />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
            </div>
          </CardContent>
        </form>
        <CardFooter>
          <Button
            size="lg"
            type="submit"
            form="change-password-form"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving…' : 'Set New Password'}
            {isPending && <Loader className="animate-spin" />}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

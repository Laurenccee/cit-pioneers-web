'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  courses,
  majorsByCourse,
  allMajors,
  years,
  sections,
} from '@/lib/data/profileOptions';
import { createStudentAuthAction } from '@/features/students/actions/createStudentAction';
import { createStudentAccount } from '@/features/students/services/studentService';

const createStudentSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  studentId: z
    .string()
    .length(6, 'Student ID must be 6 digits')
    .regex(/^\d+$/, 'Student ID must contain only numbers'),
  course: z.string().min(2, 'Course is required'),
  major: z.string().min(2, 'Major is required'),
  year: z
    .string()
    .min(1, 'Please select a year level')
    .refine((val) => ['1', '2', '3', '4'].includes(val), {
      message: 'Please select a valid year level',
    }),
  section: z.string().min(1, 'Section is required'),
});

type CreateStudentFormData = z.infer<typeof createStudentSchema>;

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateStudentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateStudentDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      studentId: '',
      course: '',
      major: '',
      year: '',
      section: '',
    },
  });

  const selectedCourse = watch('course');
  const availableMajors = selectedCourse
    ? (majorsByCourse[selectedCourse] ?? [])
    : allMajors;

  const onSubmit = (data: CreateStudentFormData) => {
    startTransition(async () => {
      // Default password is the student's ID; they must change it on first login
      const result = await createStudentAuthAction(data.email, data.studentId);

      if (result.error || !result.uid) {
        toast.error(result.error ?? 'Failed to create user account.');
        return;
      }

      try {
        await createStudentAccount(
          result.uid,
          data.firstName,
          data.lastName,
          data.email,
          data.studentId,
          data.course,
          data.major,
          parseInt(data.year),
          data.section,
          true, // mustChangePassword
        );
        toast.success(
          `${data.firstName} ${data.lastName} has been added successfully.`,
        );
        reset();
        onOpenChange(false);
        onSuccess();
      } catch (error: any) {
        toast.error(error?.message ?? 'Failed to create student profile.');
      }
    });
  };

  const onError = () => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) toast.error(firstError.message as string);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isPending) {
          if (!o) reset();
          onOpenChange(o);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create an account and profile for a new student. The default
            password will be their Student ID — they will be required to change
            it on first login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          {/* Account */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Account
            </p>
            <div className="space-y-2">
              <Label htmlFor="cs-email">Email</Label>
              <Input
                id="cs-email"
                type="email"
                placeholder="student@email.com"
                disabled={isPending}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Personal */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Personal
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cs-firstName">First Name</Label>
                <Input
                  id="cs-firstName"
                  placeholder="First name"
                  disabled={isPending}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-lastName">Last Name</Label>
                <Input
                  id="cs-lastName"
                  placeholder="Last name"
                  disabled={isPending}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-studentId">Student ID</Label>
              <Input
                id="cs-studentId"
                placeholder="6-digit ID"
                maxLength={6}
                disabled={isPending}
                {...register('studentId')}
              />
              {errors.studentId && (
                <p className="text-xs text-destructive">
                  {errors.studentId.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Academic */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Academic
            </p>
            <div className="space-y-2">
              <Label>Course</Label>
              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      setValue('major', '');
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course && (
                <p className="text-xs text-destructive">
                  {errors.course.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Major</Label>
              <Controller
                name="major"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending || availableMajors.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajors.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.major && (
                <p className="text-xs text-destructive">
                  {errors.major.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Year</Label>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y.value} value={y.value}>
                            {y.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.year && (
                  <p className="text-xs text-destructive">
                    {errors.year.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.section && (
                  <p className="text-xs text-destructive">
                    {errors.section.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

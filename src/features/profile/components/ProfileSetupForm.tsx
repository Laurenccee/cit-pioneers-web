'use client';

import { useEffect, useTransition } from 'react';
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
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { profileSetupSchema } from '@/features/profile/schemas/profileSchemas';
import { profileSetupAction } from '@/features/profile/actions/profileSetupAction';
import {
  courses,
  majorsByCourse,
  allMajors,
  years,
  sections,
} from '@/features/profile/data/profileOptions';
import { z } from 'zod';
import { IdCard, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;

export default function ProfileSetupForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      studentId: '',
      course: '',
      major: '',
      year: '',
      section: '',
    },
  });

  // Watch course field to filter majors
  const selectedCourse = watch('course');
  const selectedMajor = watch('major');
  const availableMajors = selectedCourse
    ? majorsByCourse[selectedCourse] || []
    : allMajors;

  // Clear major if it's not available for the selected course
  useEffect(() => {
    if (selectedCourse && selectedMajor) {
      const isMajorValid = availableMajors.some(
        (major) => major.value === selectedMajor,
      );
      if (!isMajorValid) {
        setValue('major', '');
      }
    }
  }, [selectedCourse, selectedMajor, availableMajors, setValue]);

  const onSubmit = (data: ProfileSetupFormData) => {
    startTransition(async () => {
      const result = await profileSetupAction(data);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.data && user) {
        // Create user profile in Firestore
        try {
          // Force token refresh to ensure email_verified claim is updated
          await user.getIdToken(true);

          const { createUserProfile } = await import('@/lib/firestore');

          await createUserProfile(
            user.uid,
            data.firstName,
            data.lastName,
            data.studentId,
            user.email!,
            data.course,
            data.major,
            parseInt(data.year),
            data.section,
          );

          toast.success('Profile created successfully!');
          router.push('/dashboard');
          router.refresh();
        } catch (error: any) {
          console.error('Firestore error:', error);

          // Show specific error message based on error code
          if (error?.code === 'permission-denied') {
            toast.error(
              'Permission denied. Please ensure your email is verified.',
            );
          } else if (error?.message) {
            toast.error(error.message);
          } else {
            toast.error('Failed to create profile. Please try again.');
          }
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get started
        </CardDescription>
      </CardHeader>
      <form id="profile-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      disabled={isPending}
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                    />
                  </InputGroup>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      disabled={isPending}
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                    />
                  </InputGroup>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <IdCard />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="studentId"
                    type="text"
                    placeholder="Enter your 6-digit student ID"
                    disabled={isPending}
                    autoComplete="off"
                    maxLength={6}
                    aria-invalid={!!errors.studentId}
                  />
                </InputGroup>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 ">
              <Label htmlFor="course">Course</Label>
              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value || '')}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.course}
                      className="h-10 w-full border-2 border-primary shadow-none"
                    >
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.value} value={course.value}>
                          {course.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Controller
                name="major"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value || '')}
                    disabled={isPending || !selectedCourse}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.major}
                      className="h-10 w-full border-2 border-primary shadow-none"
                    >
                      <SelectValue
                        placeholder={
                          selectedCourse
                            ? 'Select major'
                            : 'Select course first'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajors.length > 0 ? (
                        availableMajors.map((major) => (
                          <SelectItem key={major.value} value={major.value}>
                            {major.label}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          {selectedCourse
                            ? 'No majors available'
                            : 'Select course first'}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year Level</Label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value || '')}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.year}
                      className="h-10 w-full border-2 border-primary shadow-none"
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value || '')}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.section}
                      className="h-10 w-full border-2 border-primary shadow-none"
                    >
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </form>
      <CardFooter>
        <Button
          size="lg"
          type="submit"
          form="profile-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
}

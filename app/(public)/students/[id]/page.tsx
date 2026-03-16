'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/features/auth';
import {
  getUserProfile,
  UserProfile,
} from '@/features/auth/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function StudentDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { loading: adminLoading } = useRequireAdmin();
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminLoading) return;
    getUserProfile(id).then((data) => {
      setStudent(data ?? null);
      setLoading(false);
    });
  }, [id, adminLoading]);

  if (adminLoading || loading) return null;

  if (!student) {
    return (
      <main className="container mx-auto px-6 py-8">
        <p className="text-muted-foreground">Student not found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/students')}
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">
            {student.lastName}, {student.firstName}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            Student ID: {student.studentId}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Course</p>
            <p className="font-medium">{student.course}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Major</p>
            <p className="font-medium">{student.major}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Year Level</p>
            <p className="font-medium">Year {student.year}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Section</p>
            <p className="font-medium">{student.section}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{student.role}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

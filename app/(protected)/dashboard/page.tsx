'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '@/lib/firestore';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((data) => {
        if (!data || !data.profileCompleted) {
          // Redirect to profile setup if profile not completed
          router.push('/setup-profile');
        } else {
          setProfile(data);
        }
        setLoadingProfile(false);
      });
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  if (loading || loadingProfile) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome back, {profile?.firstName} {profile?.lastName}!
          </p>
          {profile && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Name: {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {profile.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Student ID: {profile.studentId}
              </p>
              <p className="text-sm text-muted-foreground">
                Course: {profile.course}
              </p>
              <p className="text-sm text-muted-foreground">
                Major: {profile.major}
              </p>
              <p className="text-sm text-muted-foreground">
                Year: {profile.year}
                {profile.year === 1
                  ? 'st'
                  : profile.year === 2
                    ? 'nd'
                    : profile.year === 3
                      ? 'rd'
                      : 'th'}{' '}
                Year
              </p>
              <p className="text-sm text-muted-foreground">
                Section: {profile.section}
              </p>
            </div>
          )}
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

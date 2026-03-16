'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import {
  getScheduleEntries,
  type ScheduleEntry,
} from '@/features/schedule/services/scheduleService';

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' });

export default function ScheduleCard() {
  const { profile } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setLoading(true);
    getScheduleEntries().then((entries) => {
      const filtered = entries.filter(
        (e) =>
          e.course === profile.course &&
          String(e.year) === String(profile.year) &&
          e.section === profile.section &&
          e.day.toLowerCase() === TODAY.toLowerCase(),
      );
      setClasses(filtered);
      setLoading(false);
    });
  }, [profile]);

  if (!profile) {
    return (
      <Card>
        <CardHeader className="gap-0">
          <CardTitle>Class for today</CardTitle>
          <CardDescription>Your academic classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex cursor-pointer flex-col items-center justify-center py-8 text-center transition-opacity hover:opacity-75"
            onClick={() => router.push('/sign-in')}
          >
            <p className="text-xl text-foreground">
              Login to see today&apos;s classes
            </p>
            <p className="text-base text-muted-foreground">
              Sign in to view your class schedule.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>Class for today</CardTitle>
        <CardDescription>{TODAY}&apos;s classes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-base text-muted-foreground">Loading...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xl font-medium text-foreground">
              No classes scheduled for today
            </p>
            <p className="text-base text-muted-foreground">
              Enjoy your free day!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {classes.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{entry.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.teacher} · {entry.room}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {entry.startTime} – {entry.endTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

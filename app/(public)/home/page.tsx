'use client';

import { useAuth } from '@/features/auth';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/date';
import DashboardLoading from './loading';
import ScheduleCard from '@/features/dashboard/components/ScheduleCard';
import EventsCard from '@/features/dashboard/components/EventsCard';
import Link from 'next/link';
import { Timer } from 'lucide-react';

export default function DashboardPage() {
  const { loading, loadingProfile, profile } = useAuth();

  if (loading || loadingProfile) {
    return <DashboardLoading />;
  }

  return (
    <main className="container mx-auto space-y-6 px-6 py-8">
      {/* Welcome Banner */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2 ">
          <Card className=" flex flex-row bg-transparent p-6 justify-between items-center">
            <div className="">
              <p className="text-4xl text-black">
                Good Morning,{' '}
                <span className="text-primary">
                  {!profile
                    ? 'Guest'
                    : `${profile.lastName}, ${profile.firstName} `}
                </span>
              </p>
              <h1 className="text-muted-foreground text-lg">
                Here is what's happening today, {formatDate()}
              </h1>
            </div>
          </Card>
        </div>
        <div className="grid lg:col-span-1">
          {profile && (
            <Card className="flex flex-col justify-center items-center gap-2.5 p-6">
              <p className="text-xl">Current Period: </p>
              <h1 className="flex justify-content items-center gap-0.5">
                <Timer size={14} /> {'10:00 AM'} : <Timer size={14} />{' '}
                {'12:00 PM'}
              </h1>
            </Card>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Announcements */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Latest News</CardTitle>
                <CardDescription>
                  Latest updates from Pioneers CIT
                </CardDescription>
              </div>
              <CardAction className="hover:underline text-lg text-primary">
                <Link href="/announcements">View All</Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xl font-medium text-foreground">
                  No announcements yet
                </p>
                <p className=" text-base text-muted-foreground">
                  Check back later for updates from the organization.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <EventsCard />
        </div>
        <div className="grid lg:col-span-1 gap-6">
          {/* Profile Card */}
          <ScheduleCard />
          <Card className="shrink-0">
            <CardHeader>
              <CardTitle>Upcoming Event</CardTitle>
              <CardDescription>
                Upcoming events in your schedule
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xl font-medium text-foreground">
                  No upcoming events
                </p>
                <p className=" text-base text-muted-foreground">
                  Events will appear here once they are scheduled.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Announcement</CardTitle>
              <CardDescription>Important announcements for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xl font-medium text-foreground">
                  No announcements yet
                </p>
                <p className=" text-base text-muted-foreground">
                  Check back later for updates from the organization.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
      </div>
    </main>
  );
}

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserProfile } from '@/features/auth/services/userService';
import React from 'react';

function ordinalSuffix(n: number) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

export default function () {
  const { profile } = useAuth();
  const statsCards =
    profile && profile.course
      ? [
          {
            label: 'Course',
            value: profile.course.replace('Bachelor of ', 'B.'),
          },
          { label: 'Major', value: profile.major },
          {
            label: 'Year Level',
            value: `${ordinalSuffix(profile.year!)} Year`,
          },
          { label: 'Section', value: `Section ${profile.section}` },
        ]
      : [];
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-sm leading-snug">
                {stat.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

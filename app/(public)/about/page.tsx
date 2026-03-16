'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">About</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Learn more about Pioneers CIT
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pioneers CIT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Pioneers CIT is the official student web platform for the College
              of Information Technology. It serves as a central hub for students
              to access academic information, news, schedules, and connect with
              faculty.
            </p>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground mb-1">
                  College
                </p>
                <p>College of Information Technology</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground mb-1">
                  Platform
                </p>
                <p>Student Web Portal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

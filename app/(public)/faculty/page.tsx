'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function FacultyPage() {
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Faculty</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Meet the CIT department faculty members
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-foreground">
            No faculty listed
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Faculty members and their information will be listed here.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

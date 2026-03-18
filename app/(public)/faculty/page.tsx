'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreateFacultyDialog } from '@/features/faculty/components/CreateFacultyDialog';
import { useFaculty } from '@/features/faculty/hooks/useFaculty';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';

export default function FacultyPage() {
  const { isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    faculty,
    loading,
    filteredFaculty,
    pagedFaculty,
    search,
    hasActiveFilters,
    setSearch,
    clearFilters,
    page,
    pageCount,
    setPage,
    fetchFaculty,
  } = useFaculty();

  return (
    <main className="container mx-auto space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty</h1>
          <p className="text-muted-foreground mt-1">
            {faculty.length} faculty members
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Meet the CIT department faculty members
          </p>
        </div>
        {isAdmin && (
          <Button
            size="icon-lg"
            onClick={() => setDialogOpen(true)}
            className="text-sm"
          >
            <Plus size={15} />
          </Button>
        )}
      </div>

      <CreateFacultyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchFaculty}
      />

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

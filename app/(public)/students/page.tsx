'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/features/auth';
import {
  useStudents,
  StudentsFilter,
  StudentsTable,
  CreateStudentDialog,
} from '@/features/students';

export default function AdminStudentsPage() {
  const { isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    students,
    loading,
    filteredStudents,
    pagedStudents,
    search,
    filterCourse,
    filterMajor,
    filterYear,
    filterSection,
    availableMajors,
    hasActiveFilters,
    setSearch,
    setFilterCourse,
    setFilterMajor,
    setFilterYear,
    setFilterSection,
    clearFilters,
    page,
    pageCount,
    setPage,
    fetchStudents,
  } = useStudents();

  return (
    <main className="container mx-auto space-y-6 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Students</h1>
          <p className="text-muted-foreground mt-1">
            {students.length} enrolled
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setDialogOpen(true)} className="text-sm">
            Add Student
          </Button>
        )}
      </div>

      <CreateStudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchStudents}
      />

      <StudentsFilter
        search={search}
        filterCourse={filterCourse}
        filterMajor={filterMajor}
        filterYear={filterYear}
        filterSection={filterSection}
        availableMajors={availableMajors}
        hasActiveFilters={hasActiveFilters}
        setSearch={setSearch}
        setFilterCourse={setFilterCourse}
        setFilterMajor={setFilterMajor}
        setFilterYear={setFilterYear}
        setFilterSection={setFilterSection}
        clearFilters={clearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            Students who have signed up and completed their profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">
              {hasActiveFilters
                ? 'No students match your filters.'
                : 'No enrolled students yet.'}
            </p>
          ) : (
            <StudentsTable
              pagedStudents={pagedStudents}
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

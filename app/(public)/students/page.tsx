'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/features/auth/services/userService';
import { getAllStudents } from '@/features/students/services/studentService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, UserPlus } from 'lucide-react';
import {
  courses,
  majorsByCourse,
  allMajors,
  years,
  sections,
} from '@/lib/data/profileOptions';
import { useAuth } from '@/features/auth';
import { CreateStudentDialog } from '@/features/students/components/CreateStudentDialog';

export default function AdminStudentsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes('admin') ?? false;

  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const availableMajors = filterCourse
    ? (majorsByCourse[filterCourse] ?? [])
    : allMajors;

  const fetchStudents = () => {
    setLoading(true);
    getAllStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = (() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchCourse = !filterCourse || s.course === filterCourse;
      const matchMajor = !filterMajor || s.major === filterMajor;
      const matchYear = !filterYear || String(s.year) === filterYear;
      const matchSection = !filterSection || s.section === filterSection;
      return (
        matchSearch && matchCourse && matchMajor && matchYear && matchSection
      );
    });
  })();

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
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus size={15} />
            Add Student
          </Button>
        )}
      </div>

      <CreateStudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchStudents}
      />

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9 w-64"
            placeholder="Search by name, ID or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={15} className="text-muted-foreground" />

          <Select
            value={filterCourse}
            onValueChange={(v) => {
              setFilterCourse(v === '_all' ? '' : v);
              setFilterMajor('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterMajor}
            onValueChange={(v) => setFilterMajor(v === '_all' ? '' : v)}
            disabled={availableMajors.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Majors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Majors</SelectItem>
              {availableMajors.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterYear}
            onValueChange={(v) => setFilterYear(v === '_all' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterSection}
            onValueChange={(v) => setFilterSection(v === '_all' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Sections</SelectItem>
              {sections.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filterCourse ||
            filterMajor ||
            filterYear ||
            filterSection ||
            search) && (
            <button
              onClick={() => {
                setSearch('');
                setFilterCourse('');
                setFilterMajor('');
                setFilterYear('');
                setFilterSection('');
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

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
              {search ||
              filterCourse ||
              filterMajor ||
              filterYear ||
              filterSection
                ? 'No students match your filters.'
                : 'No enrolled students yet.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Student ID</th>
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Course</th>
                    <th className="pb-2 font-medium">Year / Section</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.uid}
                      className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-2.5 pr-4 font-medium">
                        {s.lastName}, {s.firstName}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {s.studentId}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {s.email}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {s.course}
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        Year {s.year} – {s.section}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

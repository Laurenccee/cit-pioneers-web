'use client';

import { useEffect, useState } from 'react';
import {
  ScheduleEntry,
  addScheduleEntry,
  getScheduleEntries,
  deleteScheduleEntry,
} from '@/features/schedule/services/scheduleService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Trash2 } from 'lucide-react';
import { courses, years, sections } from '@/lib/data/profileOptions';
import { toast } from 'sonner';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const EMPTY_FORM = {
  subject: '',
  teacher: '',
  room: '',
  day: '',
  startTime: '',
  endTime: '',
  course: '',
  year: '',
  section: '',
};

export default function AdminSchedulePage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterDay, setFilterDay] = useState('');

  useEffect(() => {
    getScheduleEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.teacher.trim()) e.teacher = 'Teacher is required.';
    if (!form.room.trim()) e.room = 'Room is required.';
    if (!form.day) e.day = 'Day is required.';
    if (!form.startTime) e.startTime = 'Start time is required.';
    if (!form.endTime) e.endTime = 'End time is required.';
    if (!form.course) e.course = 'Course is required.';
    if (!form.year) e.year = 'Year is required.';
    if (!form.section) e.section = 'Section is required.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const result = await addScheduleEntry(form);
    setSubmitting(false);
    if (result.success) {
      toast.success('Schedule entry added.');
      setForm(EMPTY_FORM);
      setEntries(await getScheduleEntries());
    } else {
      toast.error(result.error ?? 'Failed to add entry.');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteScheduleEntry(id);
    setEntries((prev) => prev.filter((en) => en.id !== id));
    toast.success('Schedule entry deleted.');
  };

  const filtered = filterDay
    ? entries.filter((en) => en.day === filterDay)
    : entries;

  return (
    <main className="container mx-auto space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Manage Schedule</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage class schedules for each section.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Add Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} /> Add Schedule Entry
            </CardTitle>
            <CardDescription>
              Fill in the details to add a class to the schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Mathematics"
                />
                {errors.subject && (
                  <p className="text-xs text-destructive">{errors.subject}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Input
                    id="teacher"
                    value={form.teacher}
                    onChange={(e) =>
                      setForm({ ...form, teacher: e.target.value })
                    }
                    placeholder="Mr. Santos"
                  />
                  {errors.teacher && (
                    <p className="text-xs text-destructive">{errors.teacher}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    placeholder="Room 101"
                  />
                  {errors.room && (
                    <p className="text-xs text-destructive">{errors.room}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="day">Day</Label>
                <select
                  id="day"
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">Select day</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.day && (
                  <p className="text-xs text-destructive">{errors.day}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                  {errors.startTime && (
                    <p className="text-xs text-destructive">
                      {errors.startTime}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
                  {errors.endTime && (
                    <p className="text-xs text-destructive">{errors.endTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <p className="text-xs text-destructive">{errors.course}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="year">Year Level</Label>
                  <select
                    id="year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="">Select year</option>
                    {years.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-xs text-destructive">{errors.year}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="section">Section</Label>
                  <select
                    id="section"
                    value={form.section}
                    onChange={(e) =>
                      setForm({ ...form, section: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="">Select section</option>
                    {sections.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.section && (
                    <p className="text-xs text-destructive">{errors.section}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add to Schedule'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Schedule Entries ({filtered.length})</CardTitle>
                <CardDescription>All class schedule entries.</CardDescription>
              </div>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">All Days</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No schedule entries yet.
              </p>
            ) : (
              <div className="space-y-3">
                {filtered.map((en) => (
                  <div
                    key={en.id}
                    className="flex items-start justify-between rounded-md border px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-sm">{en.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {en.day} · {en.startTime}–{en.endTime} · {en.room}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {en.teacher} · Year {en.year}-{en.section} · {en.course}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => handleDelete(en.id!)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

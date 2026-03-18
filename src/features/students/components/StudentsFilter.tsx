'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Trash } from 'lucide-react';
import { courses, years, sections } from '@/lib/data/academicOptions';
import type { useStudents } from '../hooks/useStudents';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

type StudentsFilterProps = Pick<
  ReturnType<typeof useStudents>,
  | 'search'
  | 'filterCourse'
  | 'filterMajor'
  | 'filterYear'
  | 'filterSection'
  | 'availableMajors'
  | 'hasActiveFilters'
  | 'setSearch'
  | 'setFilterCourse'
  | 'setFilterMajor'
  | 'setFilterYear'
  | 'setFilterSection'
  | 'clearFilters'
>;

export function StudentsFilter({
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
}: StudentsFilterProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-md">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            id="studentId"
            type="text"
            placeholder="Search by name or Student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="flex w-full h-full items-center gap-2">
        <SlidersHorizontal
          size={15}
          className="text-muted-foreground shrink-0"
        />

        <Select
          value={filterCourse}
          onValueChange={(v) => setFilterCourse(v === '_all' ? '' : v)}
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

        {hasActiveFilters && (
          <Button
            size="icon"
            onClick={clearFilters}
            className="text-xs text-card hover:text-background underline"
          >
            <Trash size={15} />
          </Button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { StudentProfile } from '@/types';
import { getAllStudents } from '../services/studentService';
import { majorsByCourse, allMajors } from '@/lib/data/academicOptions';

const PAGE_SIZE = 10;

export function useStudents() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [page, setPage] = useState(1);

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

  const resetPage = () => setPage(1);

  const filteredStudents = (() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        (s.studentId ?? '').toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q);
      const matchCourse = !filterCourse || s.course === filterCourse;
      const matchMajor = !filterMajor || s.major === filterMajor;
      const matchYear = !filterYear || String(s.year) === filterYear;
      const matchSection = !filterSection || s.section === filterSection;
      return (
        matchSearch && matchCourse && matchMajor && matchYear && matchSection
      );
    });
  })();

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedStudents = filteredStudents.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters = !!(
    search ||
    filterCourse ||
    filterMajor ||
    filterYear ||
    filterSection
  );

  const clearFilters = () => {
    setSearch('');
    setFilterCourse('');
    setFilterMajor('');
    setFilterYear('');
    setFilterSection('');
    resetPage();
  };

  return {
    // raw data
    students,
    loading,
    // filtered + paged
    filteredStudents,
    pagedStudents,
    // filter state
    search,
    filterCourse,
    filterMajor,
    filterYear,
    filterSection,
    availableMajors,
    hasActiveFilters,
    // filter setters (each resets page)
    setSearch: (v: string) => {
      setSearch(v);
      resetPage();
    },
    setFilterCourse: (v: string) => {
      setFilterCourse(v);
      setFilterMajor('');
      resetPage();
    },
    setFilterMajor: (v: string) => {
      setFilterMajor(v);
      resetPage();
    },
    setFilterYear: (v: string) => {
      setFilterYear(v);
      resetPage();
    },
    setFilterSection: (v: string) => {
      setFilterSection(v);
      resetPage();
    },
    clearFilters,
    // pagination
    page: safePage,
    pageCount,
    setPage,
    // refetch
    fetchStudents,
  };
}

'use client';

import { useEffect, useState } from 'react';
import type { FacultyProfile } from '@/types';
import { getAllFaculty } from '../services/facultyService';

const PAGE_SIZE = 10;

export function useFaculty() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchFaculty = () => {
    setLoading(true);
    getAllFaculty().then((data) => {
      setFaculty(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const resetPage = () => setPage(1);

  const filteredFaculty = (() => {
    const q = search.toLowerCase();
    return faculty.filter((f) => {
      const matchSearch =
        f.firstName.toLowerCase().includes(q) ||
        f.lastName.toLowerCase().includes(q) ||
        (f.facultyId ?? '').toLowerCase().includes(q) ||
        (f.email ?? '').toLowerCase().includes(q);
    });
  })();

  const pageCount = Math.max(1, Math.ceil(filteredFaculty.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedFaculty = filteredFaculty.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters = !!search;

  const clearFilters = () => {
    setSearch('');
    resetPage();
  };

  return {
    // raw data
    faculty,
    loading,
    // filtered + paged
    filteredFaculty,
    pagedFaculty,
    // filter state
    search,
    hasActiveFilters,
    // filter setters (each resets page)
    setSearch: (v: string) => {
      setSearch(v);
      resetPage();
    },

    clearFilters,
    // pagination
    page: safePage,
    pageCount,
    setPage,
    // refetch
    fetchFaculty,
  };
}

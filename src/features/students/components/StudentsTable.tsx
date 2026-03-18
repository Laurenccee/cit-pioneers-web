'use client';

import type { StudentProfile } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface StudentsTableProps {
  pagedStudents: StudentProfile[];
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}

export function StudentsTable({
  pagedStudents,
  page,
  pageCount,
  setPage,
}: StudentsTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Major</TableHead>
            <TableHead>Year / Section</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedStudents.map((s) => (
            <TableRow key={s.uid}>
              <TableCell className="text-muted-foreground ">
                {s.studentId}
              </TableCell>
              <TableCell className="text-primary ">
                {s.lastName}, {s.firstName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {s.course}
              </TableCell>
              <TableCell className="text-muted-foreground">{s.major}</TableCell>
              <TableCell className="text-muted-foreground">
                {s.year} – {s.section}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
                )
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push('ellipsis');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pageCount) setPage(page + 1);
                  }}
                  aria-disabled={page === pageCount}
                  className={
                    page === pageCount ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}

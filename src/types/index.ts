export type Role = 'student' | 'faculty' | 'admin';

export interface StudentProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: Role;
  studentId?: string;
  course?: string;
  major?: string;
  year?: number;
  section?: string;
  profileCompleted: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacultyProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: Role;
  facultyId?: string;
  rank: string;
  designation?: string;
  assignedCourses?: string[];
  education?: {
    level: string;
    degree: string;
    yearGraduated: string;
    onGoing: boolean;
  }[];
  profileCompleted: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfile = StudentProfile | FacultyProfile;

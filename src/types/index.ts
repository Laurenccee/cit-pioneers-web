export type Role = 'student' | 'admin';

export interface UserProfile {
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

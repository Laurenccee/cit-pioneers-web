import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { StudentProfile } from '@/types';

const USERS_COLLECTION = 'students';

export async function getAllStudents(): Promise<StudentProfile[]> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('role', '==', 'student'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as StudentProfile);
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function studentIdExists(studentId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('studentId', '==', studentId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking studentId:', error);
    return false;
  }
}

export async function createStudentAccount(
  uid: string,
  firstName: string,
  lastName: string,
  studentId: string,
  course: string,
  major: string,
  year: number,
  section: string,
  mustChangePassword = false,
): Promise<boolean> {
  try {
    const profile: StudentProfile = {
      uid,
      firstName,
      lastName,
      studentId,
      course,
      major,
      year,
      section,
      role: 'student',
      profileCompleted: true,
      mustChangePassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(db, USERS_COLLECTION, uid), profile);
    return true;
  } catch (error) {
    console.error('Error creating student account:', error);
    return false;
  }
}

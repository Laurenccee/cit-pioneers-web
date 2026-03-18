import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { FacultyProfile } from '@/types';

const USERS_COLLECTION = 'faculty';

export async function getAllFaculty(): Promise<FacultyProfile[]> {
  try {
    console.log('Fetching all faculty profiles from Firestore...');
    const q = query(
      collection(db, USERS_COLLECTION),
      where('role', '==', 'faculty'),
    );
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} faculty profiles.`);
    return snap.docs.map((d) => {
      const data = d.data();
      console.log('Faculty profile data:', data);
      return data as FacultyProfile;
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return [];
  }
}

export async function facultyIdExists(facultyId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('facultyId', '==', facultyId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking facultyId:', error);
    return false;
  }
}

export async function createFacultyAccount(
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  facultyId: string,
  rank: string,
  designation: string,
  assignedCourses: string[],
  education: {
    level: string;
    degree: string;
    yearGraduated: string;
    onGoing: boolean;
  }[],
  mustChangePassword = false,
): Promise<boolean> {
  try {
    console.log('Creating faculty profile with data:', {
      uid,
      email,
      firstName,
      lastName,
      facultyId,
      rank,
      designation,
      assignedCourses,
      education,
      mustChangePassword,
    });

    const profile: FacultyProfile = {
      uid,
      email,
      firstName,
      lastName,
      facultyId,
      rank,
      designation,
      assignedCourses,
      education,
      role: 'faculty',
      profileCompleted: true,
      mustChangePassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(db, USERS_COLLECTION, uid), profile);
    console.log('Faculty profile created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating faculty account:', error);
    return false;
  }
}

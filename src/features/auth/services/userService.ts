import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const ADMIN_COLLECTION = 'admin';

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

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    const adminRef = doc(db, ADMIN_COLLECTION, uid);
    const adminSnap = await getDoc(adminRef);
    if (adminSnap.exists()) {
      return adminSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateMustChangePassword(
  uid: string,
  value: boolean,
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    mustChangePassword: value,
    updatedAt: new Date(),
  });
}

export async function hasCompletedProfile(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.profileCompleted ?? false;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
}

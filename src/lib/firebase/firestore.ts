import { db } from './client';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  course: string;
  major: string;
  year: number;
  section: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Check if student ID already exists
 */
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

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(
  uid: string,
  firstName: string,
  lastName: string,
  studentId: string,
  email: string,
  course: string,
  major: string,
  year: number,
  section: string,
): Promise<boolean> {
  try {
    const userProfile: Partial<UserProfile> = {
      uid,
      firstName,
      lastName,
      studentId,
      email,
      course,
      major,
      year,
      section,
      emailVerified: true,
      profileCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Attempting to create profile for:', {
      uid,
      firstName,
      lastName,
      studentId,
      email,
    });
    console.log('Writing to collection:', USERS_COLLECTION);
    console.log('Document ID:', uid);

    await setDoc(doc(db, USERS_COLLECTION, uid), userProfile);

    console.log('✅ Profile created successfully!');
    return true;
  } catch (error: any) {
    console.error('❌ Error creating user profile:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    return false;
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Check if user has completed their profile
 */
export async function hasCompletedProfile(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.profileCompleted ?? false;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
}

import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const ANNOUNCEMENTS_COLLECTION = 'announcements';

export interface AnnouncementItem {
  id?: string;
  title: string;
  body: string;
  author: string;
  createdAt?: Timestamp;
}

export async function addAnnouncement(
  data: Omit<AnnouncementItem, 'id' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding announcement:', error);
    return { success: false, error: 'Failed to add announcement.' };
  }
}

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as AnnouncementItem,
    );
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return false;
  }
}

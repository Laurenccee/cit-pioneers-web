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

const EVENTS_COLLECTION = 'events';

export interface EventItem {
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  createdAt?: Timestamp;
}

export async function addEvent(
  data: Omit<EventItem, 'id' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, EVENTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding event:', error);
    return { success: false, error: 'Failed to add event.' };
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

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

const SCHEDULE_COLLECTION = 'schedule';

export interface ScheduleEntry {
  id?: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  course: string;
  year: string;
  section: string;
  createdAt?: Timestamp;
}

export async function addScheduleEntry(
  data: Omit<ScheduleEntry, 'id' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, SCHEDULE_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding schedule entry:', error);
    return { success: false, error: 'Failed to add schedule entry.' };
  }
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  try {
    const q = query(
      collection(db, SCHEDULE_COLLECTION),
      orderBy('day'),
      orderBy('startTime'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ScheduleEntry);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export async function deleteScheduleEntry(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, SCHEDULE_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    return false;
  }
}

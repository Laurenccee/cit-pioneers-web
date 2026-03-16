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

const NEWS_COLLECTION = 'news';

export interface NewsItem {
  id?: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  createdAt?: Timestamp;
}

export async function addNews(
  data: Omit<NewsItem, 'id' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, NEWS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding news:', error);
    return { success: false, error: 'Failed to add news.' };
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const q = query(
      collection(db, NEWS_COLLECTION),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as NewsItem);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, NEWS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    return false;
  }
}

// Firebase client exports
export { app, auth, db, storage } from './client';

// Firestore helper functions
export {
  type UserProfile,
  studentIdExists,
  createUserProfile,
  getUserProfile,
  hasCompletedProfile,
} from './firestore';

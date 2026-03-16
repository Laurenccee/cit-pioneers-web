'use client';

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getUserProfile,
  UserProfile,
} from '@/features/auth/services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  loadingProfile: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profile: null,
  loadingProfile: true,
  isAdmin: false,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        document.cookie = `auth-token=${tokenResult.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        setIsAdmin(tokenResult.claims['admin'] === true);
        const data = await getUserProfile(firebaseUser.uid);
        setProfile(data ?? null);
      } else {
        document.cookie = 'auth-token=; path=/; max-age=0';
        setProfile(null);
        setIsAdmin(false);
      }
      setLoadingProfile(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, profile, loadingProfile, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

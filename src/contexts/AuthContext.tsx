import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  whatsappNumber: string;
  fullName: string;
  studentIdCode: string;
  email?: string;
  role: 'student' | 'admin';
  status: 'pending' | 'active' | 'blocked';
  balance: number;
  microjobPoints: number;
  assignedJob?: string;
  assignedJobs?: string[];
  preferredModules?: string[];
  courseCompleted?: boolean;
  companyJoinDate?: string;
  hasExperience?: boolean;
  hasCertificate?: boolean;
  certificateUrl?: string;
  passwordText?: string;
  teamLeaderName?: string;
  teamTrainerName?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdminLogin: boolean;
  setAdminLogin: (isAdmin: boolean) => void;
  isPinUnlocked: boolean;
  setIsPinUnlocked: (unlocked: boolean) => void;
  lockPortal: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PIN_STORAGE_KEY = 'unity_earning_pin_unlocked';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
  }>({
    user: null,
    profile: null,
    loading: true
  });
  
  const [isAdminLogin, setAdminLogin] = useState(false);
  const [isPinUnlocked, setIsPinUnlockedState] = useState<boolean>(() => {
    return sessionStorage.getItem(PIN_STORAGE_KEY) === 'true';
  });

  const setIsPinUnlocked = React.useCallback((unlocked: boolean) => {
    setIsPinUnlockedState(unlocked);
    if (unlocked) {
      sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(PIN_STORAGE_KEY);
    }
  }, []);

  const lockPortal = React.useCallback(() => {
    setIsPinUnlocked(false);
  }, [setIsPinUnlocked]);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (authUser) {
        unsubscribeProfile = onSnapshot(doc(db, 'users', authUser.uid), (docSnap) => {
          let profileData: UserProfile | null = null;
          if (docSnap.exists()) {
            profileData = docSnap.data() as UserProfile;
          }
          setAuthState({
            user: authUser,
            profile: profileData,
            loading: false
          });
        }, (error) => {
          console.error("Profile listener error:", error);
          setAuthState({
            user: authUser,
            profile: null,
            loading: false
          });
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const { user, profile, loading } = authState;

  const logout = React.useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = React.useMemo(() => ({ 
    user, 
    profile, 
    loading, 
    logout, 
    isAdminLogin, 
    setAdminLogin,
    isPinUnlocked,
    setIsPinUnlocked,
    lockPortal
  }), [user, profile, loading, logout, isAdminLogin, isPinUnlocked, setIsPinUnlocked, lockPortal]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

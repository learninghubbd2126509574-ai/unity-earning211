import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, MASTER_ADMIN_EMAIL } from '../lib/firebase';

export interface UserProfile {
  uid?: string;
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
  hasSelectedWorkKnowledge?: boolean;
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
  authNotice: string;
  clearAuthNotice: () => void;
  logout: () => Promise<void>;
  isAdminLogin: boolean;
  setAdminLogin: (isAdmin: boolean) => void;
  isFirebaseAdminVerified: boolean;
  isPinUnlocked: boolean;
  setIsPinUnlocked: (unlocked: boolean) => void;
  lockPortal: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PIN_STORAGE_KEY = 'unity_earning_pin_unlocked';
const ADMIN_SESSION_KEY = 'unity_earning_admin_portal';

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

  const [authNotice, setAuthNotice] = useState<string>('');
  const [isAdminLogin, setAdminLoginState] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [isPinUnlocked, setIsPinUnlockedState] = useState<boolean>(() => {
    return sessionStorage.getItem(PIN_STORAGE_KEY) === 'true';
  });

  const setAdminLogin = React.useCallback((isAdmin: boolean) => {
    setAdminLoginState(isAdmin);
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);

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

  const clearAuthNotice = React.useCallback(() => {
    setAuthNotice('');
  }, []);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (authUser) {
        const isMasterEmail =
          Boolean(authUser.email) &&
          (authUser.email!.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ||
           authUser.email!.toLowerCase() === '01919012426@portal.unityearning.internal' ||
           authUser.email!.toLowerCase() === 'admin@portal.unityearning.internal');

        if (isMasterEmail) {
          setAdminLogin(true);
        }

        unsubscribeProfile = onSnapshot(
          doc(db, 'users', authUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const profileData = docSnap.data() as UserProfile;

              if (profileData.status === 'blocked' && !isMasterEmail) {
                setAuthNotice(
                  'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক ডিঅ্যাক্টিভেট করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।'
                );
                signOut(auth).catch(() => {});
                setAuthState({
                  user: null,
                  profile: null,
                  loading: false
                });
                return;
              }

              setAuthState({
                user: authUser,
                profile: profileData,
                loading: false
              });
            } else {
              // No Firestore profile found (either new Google user awaiting registration or deleted by admin)
              setAuthState({
                user: authUser,
                profile: null,
                loading: false
              });
            }
          },
          (error) => {
            console.warn('Firestore user profile listener error:', error);
            setAuthState({
              user: authUser,
              profile: null,
              loading: false
            });
          }
        );
      } else {
        sessionStorage.removeItem('promo_shown_this_session');
        sessionStorage.removeItem('admin_popup_shown_this_session');
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
  }, [setAdminLogin]);

  const { user, profile, loading } = authState;

  const isFirebaseAdminVerified = Boolean(
    isAdminLogin ||
    (user && (
      user.uid === '3zm8FLrkycMzOOI6tXI3Kf693JD3' ||
      user.email?.toLowerCase() === '01919012426@portal.unityearning.internal' ||
      user.email?.toLowerCase() === 'admin@portal.unityearning.internal' ||
      (user.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() && user.emailVerified)
    ))
  );

  const logout = React.useCallback(async () => {
    sessionStorage.removeItem('promo_shown_this_session');
    sessionStorage.removeItem('admin_popup_shown_this_session');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminLoginState(false);
    await signOut(auth);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      profile,
      loading,
      authNotice,
      clearAuthNotice,
      logout,
      isAdminLogin,
      setAdminLogin,
      isFirebaseAdminVerified,
      isPinUnlocked,
      setIsPinUnlocked,
      lockPortal
    }),
    [
      user,
      profile,
      loading,
      authNotice,
      clearAuthNotice,
      logout,
      isAdminLogin,
      setAdminLogin,
      isFirebaseAdminVerified,
      isPinUnlocked,
      setIsPinUnlocked,
      lockPortal
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

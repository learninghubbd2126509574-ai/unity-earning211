import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, MASTER_ADMIN_EMAIL } from '../lib/firebase';
import {
  DirectAuthUser,
  DirectUserRecord,
  clearDirectSession,
  fetchDirectSessionProfile,
  getSavedDirectSession,
  saveDirectSession,
} from '../lib/directAuth';

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
  loginDirectUser: (directUser: DirectAuthUser, directProfile: UserProfile) => void;
  updateCurrentProfile: (partial: Partial<UserProfile>) => void;
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
  }>(() => {
    const direct = getSavedDirectSession();
    if (direct) {
      return {
        user: direct.user as unknown as User,
        profile: direct.profile,
        loading: false,
      };
    }
    return {
      user: null,
      profile: null,
      loading: true,
    };
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

  const loginDirectUser = React.useCallback(
    (directUser: DirectAuthUser, directProfile: UserProfile) => {
      const normalizedRecord: DirectUserRecord = {
        id: directUser.uid,
        uid: directUser.uid,
        fullName: directProfile.fullName || directUser.displayName || 'Member',
        whatsappNumber: directProfile.whatsappNumber || '',
        studentIdCode: directProfile.studentIdCode || '',
        email: directProfile.email || directUser.email || '',
        passwordText: directProfile.passwordText || '',
        teamLeaderName: directProfile.teamLeaderName || '',
        teamTrainerName: directProfile.teamTrainerName || '',
        role: directProfile.role || 'student',
        status: directProfile.status || 'active',
        assignedJob: directProfile.assignedJob || directProfile.assignedJobs?.[0] || 'typing',
        assignedJobs: directProfile.assignedJobs || ['typing'],
        preferredModules: directProfile.preferredModules || directProfile.assignedJobs || ['typing'],
        courseCompleted: directProfile.courseCompleted,
        companyJoinDate: directProfile.companyJoinDate,
        hasExperience: directProfile.hasExperience,
        hasSelectedWorkKnowledge: directProfile.hasSelectedWorkKnowledge,
        hasCertificate: directProfile.hasCertificate,
        certificateUrl: directProfile.certificateUrl,
        photoUrl: directProfile.photoUrl,
        balance: Number(directProfile.balance || 0),
        microjobPoints: Number(directProfile.microjobPoints || 0),
        createdAt: directProfile.createdAt || new Date().toISOString(),
        updatedAt: directProfile.updatedAt || new Date().toISOString(),
      };
      saveDirectSession(directUser, normalizedRecord);
      setAuthState({
        user: directUser as unknown as User,
        profile: normalizedRecord,
        loading: false,
      });
    },
    []
  );

  const updateCurrentProfile = React.useCallback((partial: Partial<UserProfile>) => {
    setAuthState((prev) => {
      if (!prev.user || !prev.profile) return prev;
      const merged = { ...prev.profile, ...partial };
      const saved = getSavedDirectSession();
      if (saved && saved.user.uid === prev.user.uid) {
        saveDirectSession(saved.user, { ...saved.profile, ...partial } as DirectUserRecord);
      }
      return { ...prev, profile: merged };
    });
  }, []);

  // Sync active direct session profile without touching Firebase quota
  useEffect(() => {
    const direct = getSavedDirectSession();
    if (!direct) return;

    let cancelled = false;
    fetchDirectSessionProfile(direct.user.uid).then((res) => {
      if (cancelled) return;
      if (!res.found) {
        // Account deleted by admin
        clearDirectSession();
        setAuthNotice('আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক মুছে ফেলা হয়েছে বা পাওয়া যায়নি।');
        setAuthState({ user: null, profile: null, loading: false });
        return;
      }
      if (res.profile) {
        if (res.profile.status === 'blocked') {
          clearDirectSession();
          setAuthNotice(
            'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক ডিঅ্যাক্টিভেট করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।'
          );
          setAuthState({ user: null, profile: null, loading: false });
          return;
        }
        saveDirectSession(direct.user, res.profile);
        setAuthState({
          user: direct.user as unknown as User,
          profile: res.profile,
          loading: false,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      // If a direct zero-limit session is already active, do not overwrite it with empty Firebase state
      const activeDirect = getSavedDirectSession();
      if (activeDirect && !authUser) {
        setAuthState({
          user: activeDirect.user as unknown as User,
          profile: activeDirect.profile,
          loading: false,
        });
        return;
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

        const cacheKey = `unity_cached_profile_${authUser.uid}`;

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
                  loading: false,
                });
                return;
              }

              try {
                localStorage.setItem(cacheKey, JSON.stringify(profileData));
              } catch {}

              setAuthState({
                user: authUser,
                profile: profileData,
                loading: false,
              });
            } else if (activeDirect) {
              setAuthState({
                user: activeDirect.user as unknown as User,
                profile: activeDirect.profile,
                loading: false,
              });
            } else {
              setAuthState({
                user: authUser,
                profile: null,
                loading: false,
              });
            }
          },
          (error) => {
            console.warn('Firestore user profile listener fallback:', error);
            // Fall back to cached or direct profile so Firebase quota limits never block login!
            let fallbackProfile: UserProfile | null = activeDirect?.profile || null;
            if (!fallbackProfile) {
              try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) fallbackProfile = JSON.parse(cached);
              } catch {}
            }
            setAuthState({
              user: authUser,
              profile: fallbackProfile,
              loading: false,
            });
          }
        );
      } else {
        sessionStorage.removeItem('promo_shown_this_session');
        sessionStorage.removeItem('admin_popup_shown_this_session');
        setAuthState({
          user: null,
          profile: null,
          loading: false,
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
      (user &&
        (user.uid === '3zm8FLrkycMzOOI6tXI3Kf693JD3' ||
          user.email?.toLowerCase() === '01919012426@portal.unityearning.internal' ||
          user.email?.toLowerCase() === 'admin@portal.unityearning.internal' ||
          (user.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() && user.emailVerified)))
  );

  const logout = React.useCallback(async () => {
    sessionStorage.removeItem('promo_shown_this_session');
    sessionStorage.removeItem('admin_popup_shown_this_session');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    clearDirectSession();
    setAdminLoginState(false);
    setAuthState({ user: null, profile: null, loading: false });
    await signOut(auth).catch(() => {});
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      profile,
      loading,
      authNotice,
      clearAuthNotice,
      logout,
      loginDirectUser,
      updateCurrentProfile,
      isAdminLogin,
      setAdminLogin,
      isFirebaseAdminVerified,
      isPinUnlocked,
      setIsPinUnlocked,
      lockPortal,
    }),
    [
      user,
      profile,
      loading,
      authNotice,
      clearAuthNotice,
      logout,
      loginDirectUser,
      updateCurrentProfile,
      isAdminLogin,
      setAdminLogin,
      isFirebaseAdminVerified,
      isPinUnlocked,
      setIsPinUnlocked,
      lockPortal,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

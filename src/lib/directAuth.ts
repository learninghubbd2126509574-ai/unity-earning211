import { normalizePhoneDigits } from './firebase';

export const DIRECT_SESSION_KEY = 'unity_direct_portal_session';
export const DIRECT_USERS_MIRROR_KEY = 'unity_direct_users_mirror';

export interface DirectAuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface DirectUserRecord {
  id: string;
  uid: string;
  fullName: string;
  whatsappNumber: string;
  studentIdCode: string;
  email: string;
  passwordText: string;
  teamLeaderName?: string;
  teamTrainerName?: string;
  role: 'student' | 'admin';
  status: 'pending' | 'active' | 'blocked';
  assignedJob?: string;
  assignedJobs?: string[];
  preferredModules?: string[];
  courseCompleted?: boolean;
  companyJoinDate?: string;
  hasExperience?: boolean;
  hasSelectedWorkKnowledge?: boolean;
  hasCertificate?: boolean;
  certificateUrl?: string;
  photoUrl?: string;
  balance: number;
  microjobPoints: number;
  createdAt: string;
  updatedAt: string;
}

function readLocalMirror(): DirectUserRecord[] {
  try {
    const raw = localStorage.getItem(DIRECT_USERS_MIRROR_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalMirror(users: DirectUserRecord[]): void {
  try {
    localStorage.setItem(DIRECT_USERS_MIRROR_KEY, JSON.stringify(users));
  } catch {}
}

function upsertMirrorUser(record: DirectUserRecord): void {
  const list = readLocalMirror();
  const idx = list.findIndex((u) => u.uid === record.uid || u.id === record.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...record };
  } else {
    list.unshift(record);
  }
  writeLocalMirror(list);
}

export function getSavedDirectSession(): { user: DirectAuthUser; profile: DirectUserRecord } | null {
  try {
    const raw = localStorage.getItem(DIRECT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user?.uid && parsed?.profile?.uid) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDirectSession(user: DirectAuthUser, profile: DirectUserRecord): void {
  try {
    localStorage.setItem(DIRECT_SESSION_KEY, JSON.stringify({ user, profile }));
  } catch {}
}

export function clearDirectSession(): void {
  try {
    localStorage.removeItem(DIRECT_SESSION_KEY);
  } catch {}
}

export async function registerDirectAccount(payload: {
  fullName: string;
  whatsappNumber: string;
  studentIdCode: string;
  email: string;
  passwordText: string;
  teamLeaderName: string;
  teamTrainerName: string;
  assignedJobs: string[];
  preferredModules: string[];
  courseCompleted: boolean;
  companyJoinDate: string;
  hasExperience: boolean;
  hasSelectedWorkKnowledge: boolean;
  hasCertificate: boolean;
  certificateUrl: string;
}): Promise<{ user: DirectAuthUser; profile: DirectUserRecord }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.profile && data?.user) {
      upsertMirrorUser(data.profile);
      return { user: data.user, profile: data.profile };
    }
    if (res.status >= 400 && res.status < 500 && data?.error) {
      throw new Error(data.error);
    }
  } catch (err: any) {
    if (err?.message && !String(err.message).toLowerCase().includes('fetch')) {
      throw err;
    }
  }

  // Fallback to local mirror if server route is unavailable
  const list = readLocalMirror();
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = normalizePhoneDigits(payload.whatsappNumber) || payload.whatsappNumber.trim();
  const cleanId = payload.studentIdCode.trim();

  if (list.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('This email is already registered. Please sign in or use another email.');
  }
  if (list.some((u) => normalizePhoneDigits(u.whatsappNumber) === cleanPhone)) {
    throw new Error('This phone number is already registered. Please sign in with your password.');
  }
  if (list.some((u) => u.studentIdCode === cleanId)) {
    throw new Error('This 7-digit Student ID is already registered. Please sign in.');
  }

  const nowIso = new Date().toISOString();
  const uid = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const profile: DirectUserRecord = {
    id: uid,
    uid,
    fullName: payload.fullName.trim(),
    whatsappNumber: cleanPhone,
    studentIdCode: cleanId,
    email: cleanEmail,
    passwordText: payload.passwordText.trim(),
    teamLeaderName: payload.teamLeaderName.trim(),
    teamTrainerName: payload.teamTrainerName.trim(),
    role: 'student',
    status: 'active',
    assignedJob: payload.assignedJobs[0] || 'typing',
    assignedJobs: payload.assignedJobs,
    preferredModules: payload.preferredModules,
    courseCompleted: payload.courseCompleted,
    companyJoinDate: payload.companyJoinDate,
    hasExperience: payload.hasExperience,
    hasSelectedWorkKnowledge: payload.hasSelectedWorkKnowledge,
    hasCertificate: payload.hasCertificate,
    certificateUrl: payload.certificateUrl || '',
    photoUrl: '',
    balance: 0,
    microjobPoints: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  upsertMirrorUser(profile);
  return {
    user: { uid, email: cleanEmail, displayName: profile.fullName },
    profile,
  };
}

export async function loginDirectAccount(
  identifier: string,
  password: string
): Promise<{
  status: 'ok' | 'not_found' | 'wrong_password' | 'blocked';
  user?: DirectAuthUser;
  profile?: DirectUserRecord;
  error?: string;
}> {
  const cleanIdent = identifier.trim();
  const cleanPass = password.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanIdent, password: cleanPass }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.profile && data?.user) {
      upsertMirrorUser(data.profile);
      return { status: 'ok', user: data.user, profile: data.profile };
    }
    if (res.status === 401) {
      return { status: 'wrong_password', error: data?.error || 'Incorrect password.' };
    }
    if (res.status === 403) {
      return { status: 'blocked', error: data?.error || 'Account deactivated.' };
    }
    if (res.status === 404) {
      // Fall through to local mirror check
    }
  } catch {
    // Fall through to local mirror check
  }

  const list = readLocalMirror();
  const identLower = cleanIdent.toLowerCase();
  const identPhone = normalizePhoneDigits(cleanIdent);
  const matched = list.find((u) => {
    if (u.email.toLowerCase() === identLower) return true;
    if (u.studentIdCode === cleanIdent) return true;
    if (identPhone.length >= 10 && normalizePhoneDigits(u.whatsappNumber) === identPhone) return true;
    return false;
  });

  if (!matched) {
    return { status: 'not_found' };
  }
  if (matched.passwordText !== cleanPass) {
    return { status: 'wrong_password', error: 'Incorrect password. Please verify your password.' };
  }
  if (matched.status === 'blocked') {
    return { status: 'blocked', error: 'Your account has been deactivated by the administrator.' };
  }

  return {
    status: 'ok',
    user: { uid: matched.uid, email: matched.email, displayName: matched.fullName },
    profile: matched,
  };
}

export async function fetchDirectSessionProfile(
  uid: string
): Promise<{ found: boolean; profile?: DirectUserRecord }> {
  try {
    const res = await fetch(`/api/auth/session/${encodeURIComponent(uid)}`);
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.profile) {
        upsertMirrorUser(data.profile);
        return { found: true, profile: data.profile };
      }
    }
    if (res.status === 404) {
      return { found: false };
    }
  } catch {}

  const mirror = readLocalMirror().find((u) => u.uid === uid || u.id === uid);
  return mirror ? { found: true, profile: mirror } : { found: false };
}

export async function updateDirectUserProfile(
  uid: string,
  updates: Partial<DirectUserRecord>
): Promise<DirectUserRecord | null> {
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(uid)}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.profile) {
        upsertMirrorUser(data.profile);
        return data.profile;
      }
    }
  } catch {}

  const list = readLocalMirror();
  const idx = list.findIndex((u) => u.uid === uid || u.id === uid);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalMirror(list);
    return list[idx];
  }
  return null;
}

export async function fetchAllDirectAdminUsers(): Promise<DirectUserRecord[]> {
  try {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data?.users)) {
        writeLocalMirror(data.users);
        return data.users;
      }
    }
  } catch {}
  return readLocalMirror();
}

export async function adminUpdateDirectUser(
  uid: string,
  updates: Partial<DirectUserRecord>
): Promise<void> {
  try {
    await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch {}

  const list = readLocalMirror();
  const idx = list.findIndex((u) => u.uid === uid || u.id === uid);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalMirror(list);
  }
}

export async function adminDeleteDirectUser(uid: string): Promise<void> {
  try {
    await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, { method: 'DELETE' });
  } catch {}
  writeLocalMirror(readLocalMirror().filter((u) => u.uid !== uid && u.id !== uid));
}

export async function adminDeleteAllDirectUsers(): Promise<void> {
  try {
    await fetch('/api/admin/users', { method: 'DELETE' });
  } catch {}
  writeLocalMirror([]);
}

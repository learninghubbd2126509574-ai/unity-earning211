import { supabase, isPlaceholderSupabase } from './supabase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

class SupabaseAuthMock {
  private currentUser: AuthUser | null = (() => {
    try {
      const saved = localStorage.getItem('unity_supabase_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    if (!isPlaceholderSupabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          this.currentUser = {
            uid: session.user.id,
            email: session.user.email || null,
            displayName: session.user.user_metadata?.full_name || 'Student Member'
          };
          this.notifyListeners();
        }
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          this.currentUser = {
            uid: session.user.id,
            email: session.user.email || null,
            displayName: session.user.user_metadata?.full_name || 'Student Member'
          };
        }
        this.notifyListeners();
      });
    }
  }

  get currentUserObj() {
    return this.currentUser;
  }

  async signOut() {
    if (!isPlaceholderSupabase) {
      try { await supabase.auth.signOut(); } catch {}
    }
    this.currentUser = null;
    localStorage.removeItem('unity_supabase_user');
    this.notifyListeners();
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.currentUser));
  }

  setCurrentUser(user: AuthUser | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('unity_supabase_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('unity_supabase_user');
    }
    this.notifyListeners();
  }
}

export const authInstance = new SupabaseAuthMock();
export const auth: any = authInstance;

// Auth Standalone helper functions replacing firebase/auth
export async function signOut(_authObj?: any): Promise<void> {
  await authInstance.signOut();
}

export function onAuthStateChanged(_authObj: any, callback: (user: AuthUser | null) => void): () => void {
  return authInstance.onAuthStateChanged(callback);
}

export async function signInWithEmailAndPassword(_authObj: any, email: string, password?: string): Promise<{ user: AuthUser }> {
  const cleanEmail = email.trim().toLowerCase();
  const users = getLocalTable('users');
  const matched = users.find((u: any) => 
    (u.email && u.email.toLowerCase() === cleanEmail) ||
    u.id === `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
  );

  if (matched && password) {
    if (matched.passwordText && matched.passwordText !== password.trim()) {
      const err: any = new Error('auth/wrong-password');
      err.code = 'auth/wrong-password';
      throw err;
    }
  }

  const uid = matched?.id || `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const user: AuthUser = { 
    uid, 
    email: matched?.email || cleanEmail, 
    displayName: matched?.fullName || cleanEmail.split('@')[0] 
  };
  authInstance.setCurrentUser(user);
  return { user };
}

export async function createUserWithEmailAndPassword(_authObj: any, email: string, _password: string): Promise<{ user: AuthUser }> {
  const uid = `user_${email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
  const user: AuthUser = { uid, email: email.trim().toLowerCase(), displayName: email.split('@')[0] };
  // Do NOT automatically set currentUser here so pending registrations don't instantly log in
  return { user };
}

export class GoogleAuthProvider {}

export async function signInWithPopup(_authObj: any, _provider: any): Promise<{ user: AuthUser }> {
  const uid = `user_google_${Date.now()}`;
  const user: AuthUser = { uid, email: 'google.admin@unityearning.com', displayName: 'Google Admin' };
  authInstance.setCurrentUser(user);
  return { user };
}

// Firestore Collection / Doc Ref wrappers for Supabase Tables
export class DocumentReference {
  constructor(public collectionName: string, public id: string) {}
}

export class CollectionReference {
  constructor(public collectionName: string) {}
}

export const db = {} as any;

export function collection(_db: any, path: string): CollectionReference {
  return new CollectionReference(path);
}

export function doc(_db: any, collectionPath: string, docId?: string): DocumentReference {
  return new DocumentReference(collectionPath, docId || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
}

export async function addDoc(colRef: CollectionReference, data: any): Promise<DocumentReference> {
  const newId = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const record = { id: newId, ...data, created_at: new Date().toISOString() };
  
  if (!isPlaceholderSupabase) {
    try {
      const { error } = await supabase.from(colRef.collectionName).insert([record]);
      if (error) {
        saveLocalTable(colRef.collectionName, record);
      }
    } catch {
      saveLocalTable(colRef.collectionName, record);
    }
  } else {
    saveLocalTable(colRef.collectionName, record);
  }

  return new DocumentReference(colRef.collectionName, newId);
}

export async function setDoc(docRef: DocumentReference, data: any, _options?: { merge: boolean }): Promise<void> {
  const record = { id: docRef.id, ...data, updated_at: new Date().toISOString() };
  if (!isPlaceholderSupabase) {
    try {
      const { error } = await supabase.from(docRef.collectionName).upsert([record]);
      if (error) {
        saveLocalTable(docRef.collectionName, record);
      }
    } catch {
      saveLocalTable(docRef.collectionName, record);
    }
  } else {
    saveLocalTable(docRef.collectionName, record);
  }
}

export async function updateDoc(docRef: DocumentReference, data: any): Promise<void> {
  if (!isPlaceholderSupabase) {
    try {
      await supabase.from(docRef.collectionName).update({ ...data, updated_at: new Date().toISOString() }).eq('id', docRef.id);
    } catch {}
  }
  saveLocalTable(docRef.collectionName, { id: docRef.id, ...data });
}

export async function getDoc(docRef: DocumentReference): Promise<any> {
  if (!isPlaceholderSupabase) {
    try {
      const { data, error } = await supabase.from(docRef.collectionName).select('*').eq('id', docRef.id).single();
      if (!error && data) {
        return {
          exists: () => true,
          data: () => data
        };
      }
    } catch {}
  }

  const local = getLocalTable(docRef.collectionName).find((r: any) => r.id === docRef.id);
  return {
    exists: () => Boolean(local),
    data: () => local || null
  };
}

export async function getDocs(queryRef: any): Promise<any> {
  const colName = queryRef.collectionName || 'general';
  const constraints = queryRef.constraints || [];
  
  if (!isPlaceholderSupabase) {
    try {
      let supabaseQuery: any = supabase.from(colName).select('*');
      for (const c of constraints) {
        if (c.op === '==') {
          supabaseQuery = supabaseQuery.eq(c.field, c.value);
        }
      }
      const { data, error } = await supabaseQuery;
      if (!error && data) {
        const docs = data.map((item: any) => ({
          id: item.id,
          exists: () => true,
          data: () => item
        }));
        return { docs, empty: docs.length === 0 };
      }
    } catch {}
  }

  let local = getLocalTable(colName);
  for (const c of constraints) {
    if (c.op === '==') {
      local = local.filter((item: any) => item[c.field] === c.value);
    }
  }
  
  const docs = local.map((item: any) => ({
    id: item.id,
    exists: () => true,
    data: () => item
  }));
  return { docs, empty: docs.length === 0 };
}

export function onSnapshot(ref: any, callback: (snapshot: any) => void, _errorCallback?: (err: any) => void): () => void {
  let active = true;

  if (ref instanceof DocumentReference) {
    const fetchDoc = async () => {
      if (!active) return;
      if (!isPlaceholderSupabase) {
        try {
          const { data, error } = await supabase.from(ref.collectionName).select('*').eq('id', ref.id).single();
          if (!error && data) {
            if (active) callback({ exists: () => true, data: () => data });
            return;
          }
        } catch {}
      }
      const local = getLocalTable(ref.collectionName).find((r: any) => r.id === ref.id);
      if (active) {
        callback({
          exists: () => Boolean(local),
          data: () => local || null
        });
      }
    };

    fetchDoc();
    const interval = setInterval(fetchDoc, 3000);
    const handleDbChange = (e: any) => {
      if (!e.detail || e.detail.tableName === ref.collectionName) {
        fetchDoc();
      }
    };
    window.addEventListener('unity_db_change', handleDbChange);
    window.addEventListener('storage', fetchDoc);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('unity_db_change', handleDbChange);
      window.removeEventListener('storage', fetchDoc);
    };
  }

  const fetchCol = async () => {
    if (!active) return;
    const colName = ref.collectionName || 'general';
    const constraints = ref.constraints || [];

    if (!isPlaceholderSupabase) {
      try {
        let supabaseQuery: any = supabase.from(colName).select('*');
        for (const c of constraints) {
          if (c.op === '==') {
            supabaseQuery = supabaseQuery.eq(c.field, c.value);
          }
        }
        const { data, error } = await supabaseQuery;
        if (!error && data) {
          const docs = data.map((item: any) => ({
            id: item.id,
            exists: () => true,
            data: () => item
          }));
          if (active) callback({ docs, empty: docs.length === 0 });
          return;
        }
      } catch {}
    }

    let local = getLocalTable(colName);
    for (const c of constraints) {
      if (c.op === '==') {
        local = local.filter((item: any) => item[c.field] === c.value);
      }
    }
    const docs = local.map((item: any) => ({
      id: item.id,
      exists: () => true,
      data: () => item
    }));
    if (active) {
      callback({ docs, empty: docs.length === 0 });
    }
  };

  fetchCol();
  const interval = setInterval(fetchCol, 3000);
  const handleDbChange = (e: any) => {
    if (!e.detail || e.detail.tableName === (ref.collectionName || 'general')) {
      fetchCol();
    }
  };
  window.addEventListener('unity_db_change', handleDbChange);
  window.addEventListener('storage', fetchCol);

  return () => {
    active = false;
    clearInterval(interval);
    window.removeEventListener('unity_db_change', handleDbChange);
    window.removeEventListener('storage', fetchCol);
  };
}

export function query(colRef: CollectionReference, ...constraints: any[]) {
  return {
    collectionName: colRef.collectionName,
    constraints: constraints.filter(c => c && c.type === 'where'),
    isQuery: true
  };
}

export function where(field: string, op: string, value: any) {
  return { type: 'where', field, op, value };
}
export function orderBy(..._args: any[]) { return {}; }
export function limit(_n: number) { return {}; }
export function increment(n: number) { return n; }
export function serverTimestamp() { return new Date().toISOString(); }
export function arrayUnion(...args: any[]) { return args; }
export function arrayRemove(...args: any[]) { return args; }
export async function deleteDoc(docRef: DocumentReference): Promise<void> {
  if (!isPlaceholderSupabase) {
    try {
      await supabase.from(docRef.collectionName).delete().eq('id', docRef.id);
    } catch {}
  }
  try {
    const list = getLocalTable(docRef.collectionName);
    const filtered = list.filter((r: any) => r.id !== docRef.id);
    localStorage.setItem(`supabase_table_${docRef.collectionName}`, JSON.stringify(filtered));
    notifyLocalTableUpdate(docRef.collectionName);
  } catch {}
}

function notifyLocalTableUpdate(tableName: string) {
  try {
    window.dispatchEvent(new CustomEvent('unity_db_change', { detail: { tableName } }));
  } catch {}
}

// LocalStorage Helper for Supabase fallback
function getLocalTable(tableName: string): any[] {
  try {
    const saved = localStorage.getItem(`supabase_table_${tableName}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean out stale mock student with 1500 balance if present
      if (tableName === 'users' && Array.isArray(parsed)) {
        const cleaned = parsed.filter(u => u.id !== 'demo-student-uid-9921');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(`supabase_table_users`, JSON.stringify(cleaned));
        }
        return cleaned;
      }
      return parsed;
    }
    return getDefaultTableData(tableName);
  } catch {
    return getDefaultTableData(tableName);
  }
}

function saveLocalTable(tableName: string, record: any) {
  try {
    const list = getLocalTable(tableName);
    const idx = list.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record };
    } else {
      list.unshift(record);
    }
    localStorage.setItem(`supabase_table_${tableName}`, JSON.stringify(list));
    notifyLocalTableUpdate(tableName);
  } catch {}
}

function getDefaultTableData(tableName: string): any[] {
  if (tableName === 'users') {
    return []; // No fake default student with 1500 balance!
  }
  if (tableName === 'settings') {
    return [
      {
        id: 'support',
        telegramUrl: 'https://t.me/unityearning',
        whatsappUrl: 'https://wa.me/8801919012426',
        videoUrl: 'https://youtube.com',
        logoUrl: ''
      },
      {
        id: 'appConfig',
        accessPin: '1234'
      }
    ];
  }
  return [];
}


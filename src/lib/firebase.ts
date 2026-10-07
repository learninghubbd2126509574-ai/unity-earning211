// Firebase has been completely removed and replaced with Supabase PostgreSQL & Adapter.
// All exports below bridge existing components to Supabase.
export { 
  db, 
  auth, 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from './supabaseAdapter';

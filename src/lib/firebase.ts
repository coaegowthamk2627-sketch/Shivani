import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  DEFAULT_COURSES,
  DEFAULT_INSTITUTIONS,
  DEFAULT_PLACEMENTS,
} from '../data/iiserInstitutionsData';
import {
  DEFAULT_NEWS,
  DEFAULT_SALARIES,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_VACANCIES,
} from '../data/iatAndCareersData';
import type { CmsPayload } from '../types/portal';

export const ADMIN_EMAIL = 'coaegowthamk2627@gmail.com';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

export async function ensureUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const existing = await getDocFromServer(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Portal User',
        role: 'user',
        createdAt: serverTimestamp(),
      });
    } else {
      const data = existing.data();
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || data.email || '',
          displayName: user.displayName || data.displayName || 'Portal User',
          role: data.role || 'user',
          createdAt: data.createdAt,
        },
        { merge: false }
      );
    }
  } catch (error) {
    // Only surface if genuine unexpected failure; auth flow shouldn't crash on non-critical profile sync
    console.warn('User profile sync notice:', error instanceof Error ? error.message : String(error));
  }
}

export type CmsCollectionName =
  | 'news'
  | 'vacancies'
  | 'scholarships'
  | 'placements'
  | 'salaries'
  | 'courses'
  | 'institutions';

export function subscribeToCmsCollections(
  onUpdate: (updater: (prev: CmsPayload) => CmsPayload) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const unsubscribers: Unsubscribe[] = [];

  const attach = <K extends CmsCollectionName>(
    colName: K,
    fallbackList: CmsPayload[K]
  ) => {
    const q = collection(db, colName);
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate((prev) => ({
            ...prev,
            [colName]: fallbackList,
          }));
          return;
        }
        const items = snapshot.docs.map((d) => d.data()) as CmsPayload[K];
        onUpdate((prev) => ({
          ...prev,
          [colName]: items,
        }));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, colName);
        } catch (wrapped) {
          if (onError && wrapped instanceof Error) {
            onError(wrapped);
          }
        }
      }
    );
    unsubscribers.push(unsub);
  };

  attach('news', DEFAULT_NEWS);
  attach('vacancies', DEFAULT_VACANCIES);
  attach('scholarships', DEFAULT_SCHOLARSHIPS);
  attach('placements', DEFAULT_PLACEMENTS);
  attach('salaries', DEFAULT_SALARIES);
  attach('courses', DEFAULT_COURSES);
  attach('institutions', DEFAULT_INSTITUTIONS);

  const metaUnsub = onSnapshot(
    doc(db, 'portalMeta', 'cmsStatus'),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.lastUpdated === 'string') {
          onUpdate((prev) => ({ ...prev, lastUpdated: data.lastUpdated }));
        }
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'portalMeta/cmsStatus');
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
  unsubscribers.push(metaUnsub);

  return () => {
    unsubscribers.forEach((u) => u());
  };
}

export async function saveCmsItem(
  colName: CmsCollectionName,
  id: string,
  data: Record<string, unknown>,
  op: OperationType = OperationType.WRITE
): Promise<void> {
  const path = `${colName}/${id}`;
  try {
    const payload = { ...data, id };
    await setDoc(doc(db, colName, id), payload);
    await setDoc(doc(db, 'portalMeta', 'cmsStatus'), {
      lastUpdated: new Date().toISOString().split('T')[0],
      seededBy: auth.currentUser?.uid || 'admin',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, op, path);
  }
}

export async function deleteCmsItem(
  colName: CmsCollectionName,
  id: string
): Promise<void> {
  const path = `${colName}/${id}`;
  try {
    await deleteDoc(doc(db, colName, id));
    await setDoc(doc(db, 'portalMeta', 'cmsStatus'), {
      lastUpdated: new Date().toISOString().split('T')[0],
      seededBy: auth.currentUser?.uid || 'admin',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedDefaultsToFirestore(): Promise<void> {
  try {
    const batch = writeBatch(db);
    const writeGroup = (colName: CmsCollectionName, items: Array<{ id: string }>) => {
      for (const item of items) {
        batch.set(doc(db, colName, item.id), item);
      }
    };

    writeGroup('news', DEFAULT_NEWS);
    writeGroup('vacancies', DEFAULT_VACANCIES);
    writeGroup('scholarships', DEFAULT_SCHOLARSHIPS);
    writeGroup('placements', DEFAULT_PLACEMENTS);
    writeGroup('salaries', DEFAULT_SALARIES);
    writeGroup('courses', DEFAULT_COURSES);
    writeGroup('institutions', DEFAULT_INSTITUTIONS);

    batch.set(doc(db, 'portalMeta', 'cmsStatus'), {
      lastUpdated: new Date().toISOString().split('T')[0],
      seededBy: auth.currentUser?.uid || 'admin',
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'cms/seedDefaults');
  }
}

export interface ContactInquiryRecord {
  id: string;
  authorUid: string;
  name: string;
  email: string;
  role: string;
  message: string;
  status: 'submitted' | 'reviewed';
  createdAt?: unknown;
}

export async function submitContactInquiry(input: {
  name: string;
  email: string;
  role: string;
  message: string;
}): Promise<ContactInquiryRecord> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required to submit an inquiry to Firestore.');
  }
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `contacts/${id}`;
  const docData = {
    id,
    authorUid: user.uid,
    name: input.name.trim(),
    email: input.email.trim(),
    role: input.role.trim(),
    message: input.message.trim(),
    status: 'submitted' as const,
    createdAt: serverTimestamp(),
  };
  try {
    await setDoc(doc(db, 'contacts', id), docData);
    return docData;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToUserContacts(
  uid: string,
  onData: (items: ContactInquiryRecord[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'contacts'),
    where('authorUid', '==', uid)
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => d.data() as ContactInquiryRecord);
      rows.sort((a, b) => {
        const ta = (a.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
        const tb = (b.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
        return tb - ta;
      });
      onData(rows);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'contacts');
      } catch {
        // Handled cleanly in logs
      }
    }
  );
}

export function subscribeToAllContacts(
  onData: (items: ContactInquiryRecord[]) => void
): Unsubscribe {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => d.data() as ContactInquiryRecord));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'contacts');
      } catch {
        // Handled cleanly in logs
      }
    }
  );
}

export async function markContactReviewed(contact: ContactInquiryRecord): Promise<void> {
  const path = `contacts/${contact.id}`;
  try {
    await setDoc(doc(db, 'contacts', contact.id), {
      ...contact,
      status: contact.status === 'reviewed' ? 'submitted' : 'reviewed',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

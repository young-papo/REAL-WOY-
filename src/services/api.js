import { auth, db, storage } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ==================== AUTH ====================

/**
 * Inscription d'un nouvel utilisateur
 */
export const signup = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
};

/**
 * Connexion d'un utilisateur existant
 */
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Obtenir l'utilisateur courant
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ==================== FIRESTORE ====================

/**
 * Récupérer un document par ID
 */
export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/**
 * Récupérer tous les documents d'une collection
 */
export const getCollection = async (collectionName, conditions = []) => {
  let q = collection(db, collectionName);

  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Ajouter un nouveau document
 */
export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Mettre à jour un document
 */
export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Supprimer un document
 */
export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

/**
 * Écouter les changements d'une collection en temps réel
 */
export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  let q = collection(db, collectionName);

  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// ==================== STORAGE ====================

/**
 * Upload d'une image
 */
export const uploadImage = async (uri, path) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Supprimer une image
 */
export const deleteImage = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// ==================== HELPERS FIRESTORE ====================

export { where, orderBy, limit, serverTimestamp };

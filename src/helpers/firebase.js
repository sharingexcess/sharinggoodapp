import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, signOut } from 'firebase/auth'
import { customAlphabet } from 'nanoid'
import { getStorage } from 'firebase/storage'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwqyz', 8)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

export const firebase = initializeApp(firebaseConfig)
export const analytics = getAnalytics(firebase)
export const auth = getAuth(firebase)
export const firestore = getFirestore(firebase)
export const storage = getStorage()

export async function generateUniqueId(collection) {
  const id = nanoid()
  const exists = await isExistingId(id, collection)
  return exists ? await generateUniqueId(collection) : id
}

export async function isExistingId(id, collection) {
  const snapshot = await getDoc(doc(firestore, collection, id))
  return snapshot.exists()
}

export function getCollection(name) {
  return firebase.firestore().collection(name)
}

export async function setFirestoreData(collection, id, value) {
  return await setDoc(doc(firestore, collection, id), value, { merge: true })
}

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, updateProfile } from 'firebase/auth'
import { nanoid } from 'nanoid'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import {
  // collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAmhJZM1KFTNre0aKJ06y_rfP43e3FMjFA',
  authDomain: 'sharinggoodapp.firebaseapp.com',
  projectId: 'sharinggoodapp',
  storageBucket: 'sharinggoodapp.appspot.com',
  messagingSenderId: '368612798165',
  appId: '1:368612798165:web:e9733cd10f74782aed7c5c',
  measurementId: 'G-MZ2QL8CFHX',
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

export async function getFirestoreData(identifier) {
  let next = 'doc'
  let query = getCollection(identifier.shift())
  while (identifier.length) {
    if (next === 'doc') {
      query = query.doc(identifier.shift())
      next = 'collection'
    } else {
      query = query.collection(identifier.shift())
      next = 'doc'
    }
  }
  return await query
    .get()
    .then(res =>
      res.data ? res.data() : res.docs ? res.docs.map(doc => doc.data()) : res
    )
}

export async function setFirestoreData(collection, id, value) {
  return await setDoc(doc(firestore, collection, id), value, { merge: true })
}

export async function deleteFirestoreData(identifier) {
  let next = 'doc'
  let query = getCollection(identifier.shift())
  while (identifier.length) {
    if (next === 'doc') {
      query = query.doc(identifier.shift())
      next = 'collection'
    } else {
      query = query.collection(identifier.shift())
      next = 'doc'
    }
  }
  return await query.delete()
}

// storage
export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + '.png')
  setLoading(true)

  const snapshot = await uploadBytes(fileRef, file)
  const photoURL = await getDownloadURL(fileRef)

  updateProfile(currentUser, { photoURL })
  setLoading(false)
  alert('Uploaded file')
}

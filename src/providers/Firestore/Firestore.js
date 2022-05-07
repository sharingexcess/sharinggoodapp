import { createContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firebase, firestore, storage } from 'helpers'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

const FirestoreContext = createContext()
FirestoreContext.displayName = 'Firestore'

function Firestore({ children }) {
  const [requests] = useCollectionData(collection(firestore, 'requests'))
  const [profiles_raw] = useCollectionData(collection(firestore, 'profiles'))
  const [profiles, setProfiles] = useState()

  useEffect(() => {
    async function populateProfiles() {
      const profiles_copied = [...profiles_raw]
      for (const profile of profiles_copied) {
        if (profile.uploaded_photo_path) {
          const url = await getDownloadURL(
            ref(storage, profile.uploaded_photo_path)
          )
          profile.photoURL = url
        }
      }
      setProfiles(profiles_copied)
    }
    if (profiles_raw) populateProfiles()
  }, [profiles_raw])

  return (
    <FirestoreContext.Provider value={{ requests, profiles }}>
      {children}
    </FirestoreContext.Provider>
  )
}

export { Firestore, FirestoreContext }

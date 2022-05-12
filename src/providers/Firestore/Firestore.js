import { createContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { COLLECTIONS, firebase, firestore, storage } from 'helpers'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { useAuth } from 'hooks'

const FirestoreContext = createContext()
FirestoreContext.displayName = 'Firestore'

function Firestore({ children }) {
  const { profile } = useAuth()

  const [requests] = useCollectionData(
    query(
      collection(firestore, COLLECTIONS.REQUESTS),
      where('is_hidden', '!=', true)
    )
  )
  const [profiles_raw] = useCollectionData(
    collection(firestore, COLLECTIONS.PROFILES)
  )
  const [profiles, setProfiles] = useState()
  const [conversations] = useCollectionData(
    query(
      collection(firestore, COLLECTIONS.CONVERSATIONS),
      where('profiles', 'array-contains', profile ? profile.id : '')
    )
  )

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
    <FirestoreContext.Provider value={{ requests, profiles, conversations }}>
      {children}
    </FirestoreContext.Provider>
  )
}

export { Firestore, FirestoreContext }

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
    collection(firestore, COLLECTIONS.REQUESTS)
  )
  const [profiles_raw] = useCollectionData(
    collection(firestore, COLLECTIONS.PROFILES)
  )
  const [profiles, setProfiles] = useState()

  const [unread_messages] = useCollectionData(
    query(
      collection(firestore, COLLECTIONS.MESSAGES),
      where('recipient_id', '==', profile ? profile.id : null),
      where('timestamp_seen', '==', null)
    )
  )

  useEffect(() => {
    if (unread_messages) {
      if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
        console.log('setting badge api')
        navigator
          .setAppBadge(unread_messages.length)
          .catch(error => console.error('Could not set badge count:', error))
      } else {
        console.log('no badge api')
      }
    }
  }, [unread_messages])

  console.log(unread_messages)

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

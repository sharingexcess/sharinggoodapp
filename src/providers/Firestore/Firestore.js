import { createContext, useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firebase, firestore } from 'helpers'
import { collection, query, where, getDocs } from 'firebase/firestore'

const FirestoreContext = createContext()
FirestoreContext.displayName = 'Firestore'

function Firestore({ children }) {
  const [requests] = useCollectionData(collection(firestore, 'requests'))
  const [profiles] = useCollectionData(collection(firestore, 'profiles'))

  // useEffect(() => {
  //   for (const profile of profiles) {
  //     if (profile.uploaded_photo_path) {
  //       // fetch their profile photo from storage
  //       // goal: generate a URL from the storage path
  //       // save that url to profile.photoURL
  //       console.log(profile.photoURL)
  //     }
  //   }
  // }, [profiles])

  useEffect(() => {
    const getPhotos = async () => {
      const q = query(collection(firebase, 'profiles'))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
      })
    }

    getPhotos()
  }, [profiles])

  return (
    <FirestoreContext.Provider value={{ requests, profiles }}>
      {children}
    </FirestoreContext.Provider>
  )
}

export { Firestore, FirestoreContext }

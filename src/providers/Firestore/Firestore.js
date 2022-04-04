import { createContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from 'helpers'
import { collection } from 'firebase/firestore'

const FirestoreContext = createContext()
FirestoreContext.displayName = 'Firestore'

function Firestore({ children }) {
  const [requests] = useCollectionData(collection(firestore, 'requests'))

  return (
    <FirestoreContext.Provider value={{ requests }}>
      {children}
    </FirestoreContext.Provider>
  )
}

export { Firestore, FirestoreContext }

import { Loading, Login, EditProfile } from 'components'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import {
  auth,
  createTimestamp,
  firestore,
  parseUserFromFirebaseResponse,
} from 'helpers'
import React, { createContext, useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export const AuthContext = createContext()

export function Auth({ children }) {
  const [user, setUser] = useState()
  const [profile, setProfile] = useState()
  // const [profile] = useDocumentData(
  //   doc(collection(firestore, 'profiles'), user ? user.id : null)
  // )

  useEffect(() => {
    if (user) {
      const userRef = doc(collection(firestore, 'profiles'), user.uid)
      console.log(userRef)
      // userRef.onSnapshot(doc => setProfile(doc.data()))
      onSnapshot(userRef, doc => {
        setProfile(doc.data())
      })
      // .update({ timestamp_last_active: createTimestamp() })
      // .then(() => userRef.onSnapshot(doc => setProfile(doc.data())))
    }
  }, [user])

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  // render a loading state until we can confirm
  // whether a user is signed in or not
  if (user === undefined) return <Loading text={'Signing in...'} />

  if (!user) return <Login />

  if (!profile)
    return (
      <AuthContext.Provider value={{ user }}>
        <EditProfile />
      </AuthContext.Provider>
    )

  return (
    <AuthContext.Provider value={{ profile }}>{children}</AuthContext.Provider>
  )
}

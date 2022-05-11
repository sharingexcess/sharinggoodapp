import { Loading, Header, CreateProfile } from 'components'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { auth, firestore, handleLogout, storage } from 'helpers'
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export function Auth({ children }) {
  const [user, setUser] = useState()
  const [profile, setProfile] = useState()

  useEffect(() => {
    if (user) {
      // setProfile(null)
      const userRef = doc(collection(firestore, 'profiles'), user.uid)
      onSnapshot(
        userRef,
        async doc => {
          const profile = doc.data()
          if (profile.uploaded_photo_path) {
            const url = await getDownloadURL(
              ref(storage, profile.uploaded_photo_path)
            )
            profile.photoURL = url
          }
          setProfile(profile)
        },
        error => console.error(error)
      )
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

  if (user === undefined || profile === null)
    return <Loading text={'Signing in...'} />

  if (user && !profile && profile !== null)
    return (
      <AuthContext.Provider value={{ user }}>
        <Header />
        <CreateProfile />
      </AuthContext.Provider>
    )

  return (
    <AuthContext.Provider value={{ user, profile, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

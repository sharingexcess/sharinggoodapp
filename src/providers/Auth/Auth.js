import { Loading, Header, CreateProfile, Error } from 'components'
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
      const userRef = doc(collection(firestore, 'profiles'), user.uid)
      onSnapshot(
        userRef,
        async doc => {
          const profile = doc.data()
          if (profile && profile.uploaded_photo_path) {
            const url = await getDownloadURL(
              ref(storage, profile.uploaded_photo_path)
            )
            profile.photoURL = url
          }
          setProfile(profile || null)
        },
        error => console.error(error)
      )
    }
  }, [user])

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => setUser(currentUser))
  }, [])

  // if there's no user or no profile, show a loading screen
  if (user === undefined) return <Loading text={'Signing in...'} />
  if (user && profile === undefined) return <Loading text={'Signing in...'} />

  // if there is a user, and the profile is "null",
  // this means that we've already checked for a profile and there is none
  // in this case, don't show an infinite loading screen,
  // instead ask the user to create a profile record
  if (user && profile === null)
    return (
      <AuthContext.Provider value={{ user }}>
        <Header />
        <CreateProfile />
      </AuthContext.Provider>
    )

  if (profile && profile.is_disabled) {
    return <Error message="Your account has been disabled." />
  }

  // once we have both a user and a profile,
  // render the content of the rest of the app
  return (
    <AuthContext.Provider value={{ user, profile, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

import { Loading, Login, Header, CreateProfile } from 'components'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { auth, firestore } from 'helpers'
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export function Auth({ children }) {
  const [user, setUser] = useState()
  const [profile, setProfile] = useState()

  useEffect(() => {
    if (user) {
      const userRef = doc(collection(firestore, 'profiles'), user.uid)
      onSnapshot(userRef, doc => {
        setProfile(doc.data())
      })
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

  if (user === undefined) return <Loading text={'Signing in...'} />

  if (!user) return <Login />

  if (!profile)
    return (
      <AuthContext.Provider value={{ user }}>
        <Header />
        <CreateProfile />
      </AuthContext.Provider>
    )

  return (
    <AuthContext.Provider value={{ profile }}>{children}</AuthContext.Provider>
  )
}

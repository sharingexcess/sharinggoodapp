import { Loading, Login } from 'components'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, parseUserFromFirebaseResponse } from 'helpers'
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export function Auth({ children }) {
  const [user, setUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(parseUserFromFirebaseResponse(currentUser))
      } else {
        setUser(null)
      }
    })
  }, [])

  // render a loading state until we can confirm
  // whether a user is signed in or not
  if (user === undefined) return <Loading text={'Signing in...'} />

  if (!user) return <Login />

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

import { createContext } from 'react'
import { Loading, Error, Login } from 'components'
import { test_users } from 'data'

export const AuthContext = createContext()

export function Auth({ children }) {
  const user = test_users.find(user => user.id === 'ryan')
  const loading = false
  const error = false

  if (loading) return <Loading text="Signing in..." />
  if (error)
    return (
      <Error message="Unable to sign in with Google Firebase Authenication." />
    )
  if (!user) return <Login />

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

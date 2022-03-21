import { AuthContext } from 'providers'
import { useContext } from 'react'

export const useAuth = () =>
  useContext(AuthContext) || {
    user: null,
  }

import { useAuth } from 'hooks'
import { Error } from 'components'

export function ProtectedRoute({ permission_level = 0, children }) {
  const { profile } = useAuth()
  if (!profile || profile.permission_level < permission_level) {
    return <Error message="You don't have permission to view this page!" />
  }
  return <>{children}</>
}

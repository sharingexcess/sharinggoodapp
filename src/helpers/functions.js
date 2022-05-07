import moment from 'moment'

export function parseUserFromFirebaseResponse(firebaseUser) {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    image: firebaseUser.photoURL,
  }
}

export const createTimestamp = d => (d ? new Date(d) : new Date())

export const formatTimestamp = (t, format) =>
  moment(t instanceof Date || typeof t === 'string' ? t : t.toDate()).format(
    format
  )

export const handleImageFallback = (e, fallback) => {
  if (e.target.src !== fallback) {
    e.target.src = fallback
  }
}

export function getPermissionLevel(num) {
  if (num === 0) return 'none'
  if (num === 1) return 'basic'
  if (num === 3) return 'creator'
  if (num === 5) return 'admin'
  if (num === 9) return 'moderator'
}

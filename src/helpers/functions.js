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
  if (num === 3) return 'verified teacher'
  if (num === 5) return 'admin'
  if (num === 9) return 'moderator'
}

// takes a phone number as a string, removes all formatting and returns in format (***) ***-****
export function formatPhoneNumber(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? '+1 ' : ''
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]]
      .join('')
      .replace('+1 ', '')
  }
  return null
}

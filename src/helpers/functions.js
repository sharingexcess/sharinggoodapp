import { signOut } from 'firebase/auth'
import { auth } from 'helpers'

export function parseUserFromFirebaseResponse(firebaseUser) {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    image: firebaseUser.photoURL,
  }
}

export function logOut() {
  signOut(auth)
}

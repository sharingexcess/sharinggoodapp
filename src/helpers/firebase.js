import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAmhJZM1KFTNre0aKJ06y_rfP43e3FMjFA',
  authDomain: 'sharinggoodapp.firebaseapp.com',
  projectId: 'sharinggoodapp',
  storageBucket: 'sharinggoodapp.appspot.com',
  messagingSenderId: '368612798165',
  appId: '1:368612798165:web:e9733cd10f74782aed7c5c',
  measurementId: 'G-MZ2QL8CFHX',
}

export const firebase = initializeApp(firebaseConfig)
export const analytics = getAnalytics(firebase)
export const auth = getAuth(firebase)

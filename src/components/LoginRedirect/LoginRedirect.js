import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useAuth } from 'hooks'
import { auth } from 'helpers'
import { Loading } from 'components/Loading/Loading'

export function LoginRedirect() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const url = window.location.href
    const email = window.localStorage.getItem('firebase_auth_email')

    if (!isSignInWithEmailLink(auth, url)) {
      // handle if login redirect url is invalid
      console.error(
        'Unable to login with redirect: invalid login redirect url,',
        window.location.href
      )
      navigate('/error')
    } else if (!email) {
      // handle if no email is stored in local storage
      console.error('Unable to login with redirect: no email in localstorage.')
      navigate('/error')
    } else {
      signInWithEmailLink(auth, email, url)
        .then(() => {
          // clear the temp storage with the signin email address
          window.localStorage.removeItem('firebase_auth_email')
          // navigate to the home page
          navigate('/')
        })
        .catch(error => {
          console.error(
            'Unable to login with redirect: invalid response from firebase auth,',
            error
          )
          navigate('/error')
        })
    }
  }, [navigate, setUser])

  return (
    <main id="LoginRedirect" className="page">
      <Loading text="Signing in" />
    </main>
  )
}

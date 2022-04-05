import { useState, useEffect } from 'react'
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { useAuth } from 'hooks'

export function Login() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const url = window.location.href
    const email = window.localStorage.getItem('firebase_auth_email')

    if (!isSignInWithEmailLink(auth, url)) {
      // handle if login redirect url is invalid
      return
    }
    if (!email) {
      // handle if no email is stored in local storage
      console.error('Unable to login with redirect: no email in localstorage.')
      navigate('/error')
    } else {
      signInWithEmailLink(auth, email, url)
        .then(() => {
          // clear the temp storage with the signin email address
          window.localStorage.removeItem('firebase_auth_email')
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

  function handleSubmit() {
    // handle if the user input is not a valid email
    if (!isEmail(email)) {
      window.alert('Please enter a valid email address!')
    } else {
      // store email in localstorage to recover later
      window.localStorage.setItem('firebase_auth_email', email)
      // use Google Firebase Auth to send an email to the user
      // containing a link with a authentication key in the URL
      sendSignInLinkToEmail(auth, email, {
        url: window.location.origin,
        handleCodeInApp: true,
      })
        // once the email is sent, update the state to change the UI
        .then(() => setSubmitted(true))
        // if the email fails to send, notify the user that an error has occurred
        .catch(error =>
          window.alert(
            `Uhoh... there was an error sending you a login email! Message: "${error}"`
          )
        )
    }
  }

  function handleReset() {
    setEmail('')
    setSubmitted(false)
  }

  function LoginConfirmation() {
    return (
      <main id="Login" className="page">
        <h2>Sent!</h2>
        <p>Check your email ({email}) for a link to finish logging in.</p>
        <button onClick={handleReset}>use a different email</button>
      </main>
    )
  }

  if (submitted) return <LoginConfirmation />
  else
    return (
      <main id="Login" className="page">
        <h1>Login</h1>
        <input
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <button onClick={handleSubmit}>Login</button>
      </main>
    )
}

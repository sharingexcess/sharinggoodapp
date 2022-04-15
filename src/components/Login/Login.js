import { useState, useEffect } from 'react'
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export function Login() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

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
  }, [navigate])

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
        <div id="login-confirmation">
          <br />
          <section id="row-1">
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="2x"
              onClick={handleReset}
              id="green"
            />
          </section>
          <section id="row-2">
            <h1>Check your email!</h1>
          </section>
          <section id="row-3">
            <p>
              We sent a magic link to <b>{email}.</b>
            </p>
            <p>Click the link to log in or sign up.</p>
          </section>
        </div>
        <footer>
          <p>
            Want to try again?{' '}
            <b>
              <a href="login" id="green" onClick={handleReset}>
                Resend link.
              </a>
            </b>
          </p>
        </footer>
      </main>
    )
  }

  if (submitted) return <LoginConfirmation />
  else
    return (
      <main id="Login" className="page">
        <div id="login-container">
          <div id="greeting">
            <h1>Login</h1>
            <p>Enter your email to receive a sign in link.</p>
          </div>

          <div id="form-field">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </div>

          <button onClick={handleSubmit}>
            <h2>Login</h2>
          </button>
        </div>
      </main>
    )
}

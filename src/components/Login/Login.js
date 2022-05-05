import { useState, useEffect } from 'react'
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { Header } from 'components/Header/Header'
import { Button, Spacer, Text } from '@sharingexcess/designsystem'

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
        url: window.location.origin + '/login',
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
      <main id="Login-Confirmation">
        <Header />
        <Spacer height={48} />
        <Text type="primary-header">Check your email!</Text>
        <Spacer height={16} />
        <Text type="small" color="grey">
          We sent a magic link to <b>{email}</b> <br />
          Click the link to log in.
        </Text>
        <Spacer height={48} />
        <Text>
          Click here to try a{' '}
          <Button
            size="large"
            type="tertiary"
            color="green"
            handler={handleReset}
          >
            different email
          </Button>
          .
        </Text>
      </main>
    )
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && email) {
      handleSubmit()
    }
  }

  if (submitted) return <LoginConfirmation />
  else
    return (
      <main id="Login">
        <Header />
        <Spacer height={48} />
        <Text type="primary-header">Login</Text>
        <Spacer height={4} />
        <Text type="small" color="grey">
          Use an email that you can access on this device.
          <br />
          We'll send you a magic link to sign in automatically.
        </Text>

        <div id="form-field">
          <label htmlFor="email">EMAIL</label>
          <input
            onKeyPress={handleKeyPress}
            type="email"
            name="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <Button color="green" size="large" fullWidth handler={handleSubmit}>
          Login
        </Button>
      </main>
    )
}

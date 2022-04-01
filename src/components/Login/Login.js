import { useState } from 'react'
import { sendSignInLinkToEmail } from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'

export function Login() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

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
        url: window.location.origin + '/login-redirect',
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

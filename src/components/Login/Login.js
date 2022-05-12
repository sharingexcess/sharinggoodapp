import { useEffect, useState } from 'react'
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { isEmail } from 'validator'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { Header, Page } from 'components'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)

  useEffect(() => {
    // clear any previous errors when the user changes the email or password
    setError(false)
  }, [email, password])

  async function handleVerifyEmail() {
    const previous_signins = await fetchSignInMethodsForEmail(auth, email)
    if (previous_signins && previous_signins.length) {
      // HANDLE CASE: user has previously signed in, and has a password.
      setEmailVerified(true)
    } else {
      // HANDLE CASE: new user, so we redirect to the sign up page
      navigate(`/signup?email=${encodeURIComponent(email)}`)
    }
  }

  async function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate('/requests'))
      .catch(error => {
        console.error(error)
        setError(true)
      })
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (inputsAreValid()) {
        emailVerified ? handleLogin() : handleVerifyEmail()
      } else
        window.alert(
          'Invalid login credentials! Please fill out your email and password.'
        )
    }
  }

  function inputsAreValid() {
    if (emailVerified) {
      return isEmail(email) && password.length >= 6
    } else return isEmail(email)
  }

  function handleResetPassword() {
    setResetPassword(true)
    sendPasswordResetEmail(auth, email)
      .then(res => console.log(res))
      .catch(e => console.error(e))
  }

  return (
    <Page id="Login">
      <Header />
      <Spacer height={48} />
      <Text type="primary-header">
        Sign in to
        <br />
        Sharing Good
      </Text>
      <Spacer height={8} />
      <Text type="small" color="grey">
        Enter your email below, and we'll go check
        <br />
        if we've seen you here before.
      </Text>
      <Spacer height={24} />
      <FlexContainer direction="vertical" secondaryAlign="start">
        <label htmlFor="email">EMAIL</label>
        <input
          onKeyPress={handleKeyPress}
          type="email"
          name="email"
          value={email}
          autoFocus={!emailVerified}
          onChange={event => setEmail(event.target.value)}
        />
        <Spacer height={24} />
        {emailVerified && (
          <>
            <label htmlFor="password">PASSWORD</label>
            <FlexContainer secondaryAlign="start">
              <input
                onKeyPress={handleKeyPress}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoFocus
              />
              <Button
                type="tertiary"
                color="blue"
                handler={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'hide' : 'show'}
              </Button>
            </FlexContainer>
          </>
        )}
      </FlexContainer>
      {error && (
        <>
          <Spacer height={16} />
          <Text color="red">
            {resetPassword ? (
              'Reset link sent! Check your email, then return to the app to log in.'
            ) : (
              <>
                Invalid password! Click{' '}
                <Button
                  type="tertiary"
                  color="blue"
                  handler={handleResetPassword}
                >
                  here
                </Button>{' '}
                to reset your password
              </>
            )}
          </Text>
        </>
      )}
      <Spacer height={24} />
      <Button
        disabled={!inputsAreValid()}
        color="green"
        size="large"
        fullWidth
        handler={emailVerified ? handleLogin : handleVerifyEmail}
      >
        {emailVerified ? 'Sign In' : 'Continue'}
      </Button>
    </Page>
  )
}

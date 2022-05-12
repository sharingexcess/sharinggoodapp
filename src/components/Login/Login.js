import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { Header } from 'components/Header/Header'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useAuth, useFirestore } from 'hooks'
// import { SignUp } from 'components/SignUp/SignUp'
// orogheneSHARES2!

export function Login() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const profiles = useFirestore('profiles')
  const navigate = useNavigate()
  const [signedUp, setSignedUp] = useState(false)

  useEffect(() => {
    if (!user) {
      if (!email) return
      if (!password) return
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          window.location.href = '/requests'
          console.log(userCredential.user)
        })
        .catch(error => {
          console.error(`[${error.code}]: ${error.message}`)
          console.error(
            'Unable to login with redirect: invalid response from firebase auth,',
            error
          )
          navigate('/error')
        })
    }
  }, [navigate, user, email])

  function handleSubmit() {
    if (!isEmail(email)) {
      window.alert('Please enter a valid email address!')
    } else if (isSignedUp(email)) {
      setSignedUp(true)
      // need to find a way to render password, sign in separately
      if (password) {
        signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            window.location.href = '/requests'
            console.log(userCredential.user)
          })
          .catch(error => {
            console.error(`[${error.code}]: ${error.message}`)
            console.error(
              'Unable to login with redirect: invalid response from firebase auth,',
              error
            )
            navigate('/error')
          })
      }
    } else {
      // not signed up, go the /signup to create a new account
      navigate('/signup')
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && email) {
      handleSubmit()
    }
  }

  function isSignedUp(email) {
    // const profile = useFirestore('profiles', email)
    for (const profile of profiles) {
      if (profile.email === email) return true
    }
    return false
  }

  return (
    <main id="Login">
      <Header />
      <Spacer height={48} />
      <Text type="primary-header">Login</Text>
      <Spacer height={4} />
      <Text type="small" color="grey">
        Use an email that you can access on this device.
      </Text>
      <div id="form-field">
        <FlexContainer direction="vertical" secondaryAlign="start">
          <Text>
            <label htmlFor="email">EMAIL</label>
            <input
              onKeyPress={handleKeyPress}
              type="email"
              name="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Text>
          {signedUp && (
            <Text>
              <label htmlFor="password">PASSWORD</label>
              <input
                onKeyPress={handleKeyPress}
                type="password"
                name="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </Text>
          )}
        </FlexContainer>
      </div>
      <Button color="green" size="large" fullWidth handler={handleSubmit}>
        Login
      </Button>
    </main>
  )
}

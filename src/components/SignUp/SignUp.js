import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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
import { useAuth } from 'hooks'

export function SignUp() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      if (!email) {
        return
      }
      if (!password) {
        return
      }
    }
  }, [navigate, user, email])

  function handleSubmit() {
    if (!isEmail(email)) {
      window.alert('Please enter a valid email address!')
    } else {
      // create user with email and password
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed in
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
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && email) {
      handleSubmit()
    }
  }

  return (
    <main id="SignUp">
      <Header />
      <Spacer height={48} />
      <Text type="primary-header">SignUp</Text>
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
        </FlexContainer>
      </div>
      <Button color="green" size="large" fullWidth handler={handleSubmit}>
        Sign Up
      </Button>
    </main>
  )
}

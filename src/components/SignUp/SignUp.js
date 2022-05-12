import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import isEmail from 'validator/lib/isEmail'
import { auth } from 'helpers'
import { useNavigate } from 'react-router'
import { Header, Page } from 'components'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'

export function SignUp() {
  const init_email = new URLSearchParams(window.location.search).get('email')
  const [email, setEmail] = useState(init_email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  function handleSubmit() {
    if (!isEmail(email)) {
      window.alert('Please enter a valid email address!')
    } else {
      // create user with email and password
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => navigate('/requests'))
        .catch(error => {
          console.error(error)
          setError(true)
        })
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (inputsAreValid()) {
        handleSubmit()
      } else
        window.alert(
          'Invalid credentials! Please enter a valid email and password.'
        )
    }
  }

  function inputsAreValid() {
    return isEmail(email) && password.length >= 6
  }

  return (
    <Page id="SignUp">
      <Header />
      <Spacer height={48} />
      <Text type="primary-header">
        Woohoo!
        <br />A new user 🎉
      </Text>
      <Spacer height={4} />
      <Text type="small" color="grey">
        Create a password below to start Sharing Good :)
      </Text>
      <Spacer height={24} />
      <FlexContainer direction="vertical" secondaryAlign="start">
        <label htmlFor="email">EMAIL</label>
        <input
          onKeyPress={handleKeyPress}
          type="email"
          name="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <Spacer height={24} />
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
        <Text type="small" color="grey">
          Your password must be more than 6 characters.
        </Text>
      </FlexContainer>

      {error && (
        <>
          <Spacer height={16} />
          <Text color="red">
            Whoops, looks like our database didn't like that password 😬 Please
            try a different one!
          </Text>
        </>
      )}
      <Spacer height={24} />
      <Button
        disabled={!inputsAreValid()}
        color="green"
        size="large"
        fullWidth
        handler={handleSubmit}
      >
        Sign Up
      </Button>
    </Page>
  )
}

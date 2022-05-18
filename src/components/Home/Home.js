import { useState } from 'react'
import { useAuth, useIsMobile } from 'hooks'
import { Link, Navigate } from 'react-router-dom'
import { Button, Spacer, Text } from '@sharingexcess/designsystem'
import { Page } from 'components'
import { IS_PWA } from 'helpers'

export function Home() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  // we'll show install instructions if they're running this in the mobile browser
  const [bypassInstall, setBypassInstall] = useState(!isMobile || IS_PWA)

  if (user) {
    return <Navigate to="/requests" />
  }
  return (
    <Page id="Home">
      <Spacer height={48} />
      <Text type="primary-header">
        Welcome to
        <br />
        Sharing Good
      </Text>
      <Spacer height={16} />
      <Text color="grey">
        We help connect teachers and social workers with the volunteers and
        supplies students need to succeed.
      </Text>
      <Spacer height={32} />
      {bypassInstall ? (
        <>
          <Link to="/login">
            <Button size="large" color="green" fullWidth>
              Login
            </Button>
          </Link>
          <Spacer height={16} />
          <Link to="/requests">
            <Button size="large" color="green" type="secondary" fullWidth>
              Browse Requests
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/install">
            <Button size="large" color="green" fullWidth>
              Click Here to Install
            </Button>
          </Link>
          <Spacer height={32} />
          <Button
            color="green"
            type="tertiary"
            handler={() => setBypassInstall(true)}
            fullWidth
          >
            Continue in the Browser
          </Button>
        </>
      )}
    </Page>
  )
}

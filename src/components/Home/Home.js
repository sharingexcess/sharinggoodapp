import { useAuth, useIsMobile } from 'hooks'
import { Link, Navigate } from 'react-router-dom'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Page } from 'components'
import { IS_PWA } from 'helpers'

export function Home() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  // we'll show install instructions if they're running this in the mobile browser
  const bypassInstall = !isMobile || IS_PWA

  if (user) {
    return <Navigate to="/requests" />
  }

  return (
    <Page id="Home">
      <FlexContainer
        direction="vertical"
        id="Home-banner"
        secondaryAlign="start"
      >
        <Spacer height={96} />
        <img
          id="Home-banner-img"
          src={isMobile ? '/home_bg_mobile.png' : '/home_bg_desktop.png'}
          alt="Background"
        />
        <Spacer height={48} />
        <Text type="primary-header" color="white">
          Find what you
          <br />
          can give.
        </Text>
        <Spacer height={12} />
        <Text color="white">
          <b>Sharing Good</b> helps connect teachers and social workers with the
          volunteers and supplies students need to succeed.
        </Text>
        <Spacer height={48} />
      </FlexContainer>
      <Spacer height={32} />
      {bypassInstall ? (
        <>
          <Link to="/login">
            <Button size="large" color="green" fullWidth>
              Login
            </Button>
          </Link>
          <Spacer height={24} />

          <Link to="/requests">
            <Button size="medium" color="green" type="secondary" fullWidth>
              Browse Requests
            </Button>
          </Link>
          <Spacer height={16} />
          <Link to="/about">
            <Button size="medium" color="green" type="tertiary" fullWidth>
              Learn More
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
          <Spacer height={16} />
          <Link to="/requests">
            <Button color="green" type="secondary" fullWidth>
              Continue in the Browser
            </Button>
          </Link>
          <Spacer height={24} />
          <Link to="/about">
            <Button size="medium" color="green" type="tertiary" fullWidth>
              Learn More
            </Button>
          </Link>
        </>
      )}
      <footer>
        © {new Date().getFullYear()} Sharing Excess & For Good PGH
      </footer>
    </Page>
  )
}

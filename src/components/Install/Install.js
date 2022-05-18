import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Page } from 'components'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export function Install() {
  const navigate = useNavigate()
  const [os, setOS] = useState(getMobileOperatingSystem())

  function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/android/i.test(userAgent)) {
      return 'Android'
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS'
    } else {
      navigate('/')
    }
  }

  return (
    <Page id="Install">
      <FlexContainer direction="vertical">
        <Text type="primary-header">
          Installing the
          <br />
          Sharing Good App
        </Text>

        <Spacer height={24} />
        <FlexContainer primaryAlign="start" id="Requests-filters">
          <Button
            fullWidth
            size="small"
            color="green"
            type={os === 'iOS' ? 'primary' : 'secondary'}
            handler={() => setOS('iOS')}
          >
            iOS
          </Button>
          <Spacer width={16} />
          <Button
            fullWidth
            size="small"
            color="green"
            type={os === 'android' ? 'primary' : 'secondary'}
            handler={() => setOS('android')}
          >
            Android
          </Button>
        </FlexContainer>
        <Spacer height={8} />
        {os === 'iOS' ? (
          <>
            <ol>
              <li>Make sure you're using Safari!</li>
              <li>
                In the footer, click the
                <img
                  id="Install-share-icon"
                  src="/share.png"
                  alt="Share"
                />{' '}
                button
              </li>
              <li>Scroll down to "Add to Home Screen"</li>
            </ol>
            <img id="Install-img" src="/ios_install.png" alt="Install iOS" />
          </>
        ) : os === 'android' ? (
          <>
            <ol>
              <li>Make sure you're using Chrome!</li>
              <li>
                In the header, click the
                <img
                  id="Install-share-icon"
                  src="/android_menu.png"
                  alt="Menu"
                />{' '}
                button
              </li>
              <li>Tap "Add to Home Screen"</li>
            </ol>
            <img
              id="Install-img"
              src="/android_install.png"
              alt="Install Android"
            />
          </>
        ) : (
          <Navigate to="/" />
        )}
        <Spacer height={32} />
        <Text align="center">You're all set! Enjoy Sharing Good 💚</Text>
        <Spacer height={16} />
        <Link to="/">
          <Button color="green" type="secondary">
            Back to Home
          </Button>
        </Link>
      </FlexContainer>
    </Page>
  )
}

import { useAuth, useIsMobile } from 'hooks'
import {
  FlexContainer,
  Text,
  Button,
  Spacer,
} from '@sharingexcess/designsystem'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { useState } from 'react'
import { Menu } from 'components'

export function Header() {
  const { user, profile } = useAuth()
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(!isMobile)

  return (
    <FlexContainer
      id="Header"
      direction="hoizontal"
      primaryAlign="space-between"
    >
      <Menu isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <Link to="/">
        <FlexContainer>
          <img id="Header-icon" src="/icon.png" alt="Sharing Good" />
          <Spacer height={8}></Spacer>
          <Text type="secondary-header">
            Sharing <span id="green">Good</span>
          </Text>
        </FlexContainer>
      </Link>
      {user && profile && isMobile && (
        <Button type="tertiary" handler={() => setMenuOpen(true)}>
          <img src="/hamburger.png" alt="request owner" />
        </Button>
      )}
      {!user && !['/login', '/signup'].includes(pathname) && (
        <Link to="/login">
          <Button color="green" size="small">
            Login
          </Button>
        </Link>
      )}
    </FlexContainer>
  )
}

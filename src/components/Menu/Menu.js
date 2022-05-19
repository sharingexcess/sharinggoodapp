import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useAuth, useIsMobile } from 'hooks'
import { Text, Spacer } from '@sharingexcess/designsystem'
import { auth, getPermissionLevel } from 'helpers'
import { Emoji } from 'react-apple-emojis'
import { ProfilePhoto } from 'components/ProfilePhoto/ProfilePhoto'
import { signOut } from 'firebase/auth'

export function Menu({ isOpen, setIsOpen }) {
  const { pathname } = useLocation()
  // get current user state from AuthContext
  const { profile } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) setIsOpen(false)
  }, [isMobile]) // eslint-disable-line

  // don't show the menu on the home screen
  if (pathname === '/') return null

  function closeMenu() {
    setIsOpen(false)
  }

  function isCurrentRoute(url) {
    return pathname.substring(1, pathname.length).includes(url)
  }

  async function logout() {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsOpen(false)
      await signOut(auth)
      navigate('/')
      window.location.reload()
    }
  }

  function MenuLink({ url, label, emoji, num }) {
    return (
      <>
        <li onClick={() => setIsOpen(false)}>
          <Link to={url}>
            <Text
              type="subheader"
              classList={['Menu-link']}
              color={isCurrentRoute(url) ? 'green' : 'black'}
            >
              <Emoji name={emoji} width={num} />
              {label}
            </Text>
          </Link>
        </li>
        <Spacer height={16} />
      </>
    )
  }

  function UserProfile() {
    return profile ? (
      <div id="UserProfile">
        <Link to="/profile" onClick={() => setIsOpen(false)}>
          <ProfilePhoto profile={profile} id="ProfileImg" />
          <div>
            <Text type="section-header" id="UserName">
              {profile && profile.name}
            </Text>
            <h3 id="UserEmail">{profile && profile.email}</h3>
            <Text type="small" color="grey" id="UserProfile-permission">
              {profile && getPermissionLevel(profile.permission_level)}
            </Text>
          </div>
        </Link>
      </div>
    ) : (
      <Text type="secondary-header">Menu</Text>
    )
  }
  return (
    <>
      {isOpen && isMobile ? (
        <div id="MenuBackground" onClick={closeMenu} />
      ) : null}
      <aside id="Menu" className={isOpen ? 'open' : 'closed'}>
        <UserProfile />
        <div id="MenuContent">
          <ul>
            {!profile && (
              <MenuLink
                emoji="check-mark-button"
                num={20}
                label="&nbsp;&nbsp;Login"
                url="/login"
              />
            )}
            <MenuLink
              emoji="question-mark"
              num={20}
              label="&nbsp;&nbsp;Requests"
              url="/requests"
            />

            {profile && (
              <>
                {profile.permission_level >= 3 && (
                  <MenuLink
                    emoji="plus"
                    num={20}
                    label="&nbsp;&nbsp;Create Request"
                    url="/create-request"
                  />
                )}
                <MenuLink
                  emoji="envelope"
                  num={20}
                  label="&nbsp;&nbsp;Messages"
                  url="/messages"
                />
                <MenuLink
                  emoji="family"
                  num={20}
                  label="&nbsp;&nbsp;Profiles"
                  url="/profiles"
                />
              </>
            )}

            <MenuLink
              emoji="person-raising-hand"
              num={20}
              label="&nbsp;&nbsp;Help"
              url="/help"
            />
            {profile && (
              <li onClick={logout}>
                <Text type="subheader" color="black" classList={['Menu-link']}>
                  <Emoji name="door" width={20} />
                  &nbsp;&nbsp;Logout
                </Text>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  )
}

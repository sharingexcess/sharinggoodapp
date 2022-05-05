import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useAuth, useIsMobile } from 'hooks'
import { Text, Spacer } from '@sharingexcess/designsystem'
import {
  DEFAULT_PROFILE_IMG,
  getPermissionLevel,
  handleImageFallback,
} from 'helpers'
import { Emoji } from 'react-apple-emojis'

export function Menu({ isOpen, setIsOpen }) {
  const { pathname } = useLocation()
  // get current user state from AuthContext
  const { profile, handleLogout } = useAuth()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) setIsOpen(false)
  }, [isMobile]) // eslint-disable-line

  function closeMenu() {
    setIsOpen(false)
  }

  function isCurrentRoute(url) {
    return pathname.substring(1, pathname.length).includes(url)
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
          <img
            src={profile ? profile.photoURL : DEFAULT_PROFILE_IMG}
            id="ProfileImg"
            alt="User"
            onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
            onClick={() => setIsOpen(true)}
          />
          <div>
            <Text type="section-header" id="UserName">
              {profile && profile.name}
            </Text>
            <h3 id="UserEmail">{profile && profile.email}</h3>
            <Text type="small" color="grey" id="UserProfile-permission">
              Sharing Good{' '}
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
            <MenuLink
              emoji="question-mark"
              num={20}
              label="&nbsp;&nbsp;Requests"
              url="/"
            />
            <MenuLink
              emoji="person-raising-hand"
              num={20}
              label="&nbsp;&nbsp;Help"
              url="/help"
            />
            {!profile && (
              <MenuLink
                emoji="check-mark-button"
                num={20}
                label="&nbsp;&nbsp;Login"
                url="/login"
              />
            )}
            {profile && (
              <>
                <MenuLink
                  emoji="person"
                  num={20}
                  label="&nbsp;&nbsp;Profile"
                  url="/profile"
                />

                <li
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                >
                  <Text
                    type="subheader"
                    color="black"
                    classList={['Menu-link']}
                  >
                    <Emoji name="door" width={20} />
                    &nbsp;&nbsp;Logout
                  </Text>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>
    </>
  )
}

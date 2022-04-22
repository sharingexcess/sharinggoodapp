import { signOut } from 'firebase/auth'
import { auth } from 'helpers'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export function Header() {
  const { profile } = useAuth()

  return (
    <header id="Header">
      <section id="Header-banner">
        <a href="/">
          <h2>
            Sharing <span id="green">Good</span>
          </h2>
        </a>
      </section>
      {profile && (
        <section id="Header-profile">
          <div id="Header-profile-info">
            <FontAwesomeIcon icon={faBars} size="2x" className="menu" />
            {/* <h4>{profile.name}</h4>
            <aside>{profile.email}</aside>
            <button onClick={() => signOut(auth)}>sign out</button>
            <img src={profile.image} alt="profile" /> */}
          </div>
        </section>
      )}
    </header>
  )
}

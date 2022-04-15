import { signOut } from 'firebase/auth'
import { auth } from 'helpers'
import { useAuth } from 'hooks'

export function Header() {
  const { profile } = useAuth()

  return (
    <header id="Header">
      <section id="Header-banner">
        <h2>
          Sharing <span id="green">Good</span>
        </h2>
      </section>
      {/* {profile && (
        <section id="Header-profile">
          <div id="Header-profile-info">
            <h4>{profile.name}</h4>
            <aside>{profile.email}</aside>
            <button onClick={() => signOut(auth)}>sign out</button>
          </div>
          <img src={profile.image} alt="profile" />
        </section>
      )} */}
    </header>
  )
}

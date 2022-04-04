import { signOut } from 'firebase/auth'
import { auth } from 'helpers'
import { useAuth } from 'hooks'

export function Header() {
  const { user } = useAuth()

  return (
    <header id="Header">
      <section id="Header-banner">
        <h2>Sharing Good</h2>
        <aside>powered by Free Store 15104 x Sharing Excess</aside>
      </section>
      {user && (
        <section id="Header-profile">
          <div id="Header-user-info">
            <h4>{user.name}</h4>
            <aside>{user.email}</aside>
            <button onClick={() => signOut(auth)}>sign out</button>
          </div>
          <img src={user.image} alt="User" />
        </section>
      )}
    </header>
  )
}

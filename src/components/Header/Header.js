import { useAuth } from 'hooks'

export function Header() {
  const { user } = useAuth()

  return (
    <header id="Header">
      <section id="Header-banner">
        <h2>Sharing Good</h2>
        <aside>powered by Free Store 15104 x Sharing Excess</aside>
      </section>
      <section id="Header-profile">
        <div id="Header-user-info">
          <h4>{user.name}</h4>
          <h3>{user.email}</h3>
        </div>
        <img src={user.image} />
      </section>
    </header>
  )
}

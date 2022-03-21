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
          <aside>{user.email}</aside>
        </div>
        <img src={user.image} />
      </section>
    </header>
  )
}

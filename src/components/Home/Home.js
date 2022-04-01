import { useAuth } from 'hooks'
import { useNavigate } from 'react-router'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  function AuthenticatedHomepage() {
    return (
      <div id="Home" className="page">
        <h2>Sucessfully logged in {user.name} </h2>
      </div>
    )
  }

  function UnauthenticatedHomepage() {
    return (
      <div id="Home" className="page">
        <h2>Home</h2>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    )
  }

  if (user) {
    return <AuthenticatedHomepage />
  } else {
    return <UnauthenticatedHomepage />
  }
}

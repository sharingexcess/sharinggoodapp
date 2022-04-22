import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'
import { Link } from 'react-router-dom'

export function Home() {
  const { profile } = useAuth()
  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {profile.name}</h2>
      <Link to="/profile">Edit Profile</Link>
      <Link to="/requests">Requests</Link>
      {/* <Requests /> */}
      <Form />
    </div>
  )
}

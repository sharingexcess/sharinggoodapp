import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'
// import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export function Home() {
  const { profile } = useAuth()
  // const navigate = useNavigate()
  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {profile.name}</h2>
      {/* <button onClick={navigate('/profile')}>Edit Profile</button> */}
      <Link to="/profile">Edit Profile</Link>
      <Requests />
      <Form />
    </div>
  )
}

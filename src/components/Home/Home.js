import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'
// import { useNavigate } from 'react-router'

export function Home() {
  const { profile } = useAuth()
  // const navigate = useNavigate()
  console.log(profile)
  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {profile.name}</h2>
      {/* <button onClick={navigate('/profile')}>Edit Profile</button> */}
      <Requests />
      <Form />
    </div>
  )
}

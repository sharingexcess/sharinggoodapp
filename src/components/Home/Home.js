import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'
import { Link } from 'react-router-dom'
import { Button, Spacer } from '@sharingexcess/designsystem'

export function Home() {
  const { profile } = useAuth()
  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {profile.name}</h2>
      <Button>
        <Link to="/profile">Edit Profile</Link>
      </Button>
      <Spacer height={16} />
      <Button>
        <Link to="/requests">Requests</Link>
      </Button>
      <Form />
    </div>
  )
}

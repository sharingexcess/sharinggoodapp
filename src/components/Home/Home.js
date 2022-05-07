import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Link } from 'react-router-dom'
import { Button, Spacer, Text } from '@sharingexcess/designsystem'

export function Home() {
  const { profile } = useAuth()
  return (
    <div id="Home">
      <Text type="primary-header">Welcome to Sharing Good</Text>
      <Link to="/profile">
        <Button color="green">Edit Profile</Button>
      </Link>
      <Spacer height={16} />
      <Link to="/requests">
        <Button size="large" color="green" fullWidth>
          Browse Requests
        </Button>
      </Link>
    </div>
  )
}

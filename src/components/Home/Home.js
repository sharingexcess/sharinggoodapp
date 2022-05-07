import { useAuth } from 'hooks'
import { Link, Navigate } from 'react-router-dom'
import { Button, Spacer, Text } from '@sharingexcess/designsystem'

export function Home() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/requests" />
  }
  return (
    <div id="Home">
      <Spacer height={48} />
      <Text type="primary-header">
        Welcome to
        <br />
        Sharing Good
      </Text>
      <Spacer height={16} />
      <Text color="grey">
        We help connect teachers and social workers with the volunteers and
        supplies students need to succeed.
      </Text>
      <Spacer height={32} />
      <Link to="/login">
        <Button size="large" color="green" fullWidth>
          Login
        </Button>
      </Link>
      <Spacer height={16} />
      <Link to="/requests">
        <Button size="large" color="green" type="secondary" fullWidth>
          Browse Requests
        </Button>
      </Link>
    </div>
  )
}

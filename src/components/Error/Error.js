import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useNavigate } from 'react-router'

export function Error({ message }) {
  const navigate = useNavigate()

  return (
    <div id="Error" className="page">
      <FlexContainer direction="vertical">
        <h1 role="img">🚨</h1>

        <Text type="primary-header">Whoops!</Text>

        <Text color="grey">
          Looks like this page isn't working, or doesn't exist.
        </Text>

        <Spacer height={32} />

        <Button color="green" onClick={() => window.location.reload()}>
          Reload Current Page
        </Button>

        <Spacer height={8} />

        <Button color="green" onClick={() => navigate('/')}>
          Return Home
        </Button>
        {message && <aside>Error Message: {message}</aside>}
      </FlexContainer>
    </div>
  )
}

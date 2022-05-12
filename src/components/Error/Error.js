import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Page } from 'components'
import { useNavigate } from 'react-router'

export function Error({ message }) {
  const navigate = useNavigate()

  return (
    <Page id="Error">
      <FlexContainer direction="vertical">
        <h1 role="img">🚨</h1>

        <Text type="primary-header">Whoops!</Text>

        <Text color="grey" align="center">
          Looks like there's something wrong with this page.
        </Text>

        <Spacer height={32} />

        <Button color="green" handler={() => window.location.reload()}>
          Reload Current Page
        </Button>

        <Spacer height={8} />

        <Button color="green" handler={() => navigate('/')}>
          Return Home
        </Button>
        <Spacer height={32} />
        {message && (
          <Text type="small" color="grey" align="center">
            Message: {message}
          </Text>
        )}
      </FlexContainer>
    </Page>
  )
}

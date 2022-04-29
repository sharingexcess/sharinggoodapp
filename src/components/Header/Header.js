import { useAuth } from 'hooks'
import { FlexContainer, Text } from '@sharingexcess/designsystem'

export function Header() {
  const { profile } = useAuth()

  return (
    <FlexContainer
      id="Header"
      direction="hoizontal"
      primaryAlign="space-between"
    >
      <a href="/">
        <Text bold>
          Sharing <span id="green">Good</span>
        </Text>
      </a>
      {profile && <img src="/hamburger.png" alt="request owner" />}
    </FlexContainer>
  )
}

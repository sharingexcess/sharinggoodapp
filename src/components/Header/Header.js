import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FlexContainer, Spacer, Text } from '@sharingexcess/designsystem'

export function Header() {
  const { profile } = useAuth()

  return (
    <FlexContainer direction="vertical">
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
        {profile && (
          // <FontAwesomeIcon icon={faBars} size="2x" className="menu" />
          <img src="/hamburger.png" alt="request owner" />
        )}
      </FlexContainer>
      <Spacer height={8}></Spacer>
    </FlexContainer>
  )
}

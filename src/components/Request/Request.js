import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FlexContainer, Spacer, Text } from '@sharingexcess/designsystem'

export function Request({ data }) {
  const { description, school, title } = data
  return (
    <FlexContainer
      id="request-container"
      direction="vertical"
      primaryAlign="start"
    >
      <FlexContainer direction="horizontal" primaryAlign="start" fullWidth>
        <Text bold>{title}</Text>
      </FlexContainer>
      <FlexContainer horizontal primaryAlign="start">
        <FontAwesomeIcon icon={faLocationDot} style={{ color: '#4EA528' }} />
        <Spacer width={8}></Spacer>
        <Text type="subheader" color="green" bold>
          {school}
        </Text>
      </FlexContainer>
      <FlexContainer direction="horizontal" primaryAlign="start" fullWidth>
        <Text type="paragraph" color="grey">
          {description}
        </Text>
      </FlexContainer>
    </FlexContainer>
    // <div id="request-container">
    //   <h3>{title}</h3>
    //   <Button color="green" size="large">
    //     Hello
    //   </Button>
    //   <div id="school">
    //     <FontAwesomeIcon icon={faLocationDot} style={{ color: '#4EA528' }} />
    //     <aside>{school}</aside>
    //   </div>
    //   <p>{description}</p>
    // </div>
  )
}

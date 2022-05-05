import { FlexContainer, Text } from '@sharingexcess/designsystem'
import { Ellipsis } from 'components'

export function Loading({ text }) {
  return (
    <FlexContainer id="Loading" direction="vertical">
      <Text type="primary-header" role="img" align="center">
        ⚙️
      </Text>
      <Text type="section-header" align="center">
        {text || 'Loading'}
        <Ellipsis />
      </Text>
    </FlexContainer>
  )
}

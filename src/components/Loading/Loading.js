import { FlexContainer, Text } from '@sharingexcess/designsystem'
import { Ellipsis, Page } from 'components'

export function Loading({ text }) {
  return (
    <Page id="Loading">
      <FlexContainer direction="vertical">
        <Text type="primary-header" role="img" align="center">
          ⚙️
        </Text>
        <Text type="section-header" align="center">
          {text || 'Loading'}
          <Ellipsis />
        </Text>
      </FlexContainer>
    </Page>
  )
}

import React from 'react'
import { useFirestore } from 'hooks/useFirestore'
import { FlexContainer, Text, Spacer } from '@sharingexcess/designsystem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export function Requests() {
  const requests = useFirestore('requests')

  function Request({ r }) {
    return (
      <Link
        to={`/requests/${r.id}`}
        key={r.id}
        style={{ textDecoration: 'none', width: '100%' }}
      >
        <FlexContainer
          id="request-container"
          direction="vertical"
          primaryAlign="start"
          secondaryAlign="start"
          fullWidth
        >
          <Text bold>{r.title}</Text>
          <FlexContainer direction="horizontal" primaryAlign="start">
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: '#4EA528' }}
            />
            <Spacer width={8}></Spacer>
            <Text type="subheader" color="green" bold>
              {r.school}
            </Text>
          </FlexContainer>
          <Text type="paragraph" color="grey">
            {r.description}
          </Text>
        </FlexContainer>
      </Link>
    )
  }

  return (
    <div id="requests-container" className="page">
      <FlexContainer direction="vertical" secondaryAlign="start" fullWidth>
        <FlexContainer primaryAlign="space-between">
          <Text type="primary-header" align="left" bold>
            Open Requests
          </Text>
          <Link to="/create-request">
            <FontAwesomeIcon icon={faPlusCircle} id="green" size="2x" />
          </Link>
        </FlexContainer>
        {requests &&
          requests.map(request => <Request key={request.id} r={request} />)}
      </FlexContainer>
    </div>
  )
}

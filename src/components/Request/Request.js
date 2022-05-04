import React from 'react'
import {
  Button,
  FlexContainer,
  Image,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useParams } from 'react-router'
import { useFirestore } from 'hooks'
import { Loading } from 'components/Loading/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export function GetProfile({ r }) {
  const p = useFirestore('profiles', r.owner_id)
  return <>{!p ? <Loading /> : <span>{p.name.split(' ')[0]}</span>}</>
}

export function GetProfileFullName({ r }) {
  const p = useFirestore('profiles', r.owner_id)
  return (
    <main>
      {!p ? (
        <Loading />
      ) : (
        <FlexContainer>
          <Text bold>{p.name}</Text>
        </FlexContainer>
      )}
    </main>
  )
}

export function GetProfilePhoto({ r }) {
  const p = useFirestore('profiles', r.owner_id)
  return (
    <main>
      {!p ? (
        <Loading />
      ) : (
        <FlexContainer>
          <Image src={p.photoURL} />
        </FlexContainer>
      )}
    </main>
  )
}

export function Request() {
  const { request_id } = useParams()
  const r = useFirestore('requests', request_id)
  return (
    <main id="request-details" className="page">
      {!r ? (
        <Loading />
      ) : (
        <FlexContainer
          id="request-details-container"
          direction="vertical"
          primaryAlign="space-between"
          fullWidth
        >
          <FlexContainer direction="vertical" secondaryAlign="start">
            <FlexContainer primaryAlign="space-between">
              <Link to="/requests">
                <FontAwesomeIcon icon={faArrowLeft} id="green" />
              </Link>
              <Spacer />
              <Text>{r.status}</Text>
              <Spacer />
              <Spacer />
            </FlexContainer>
            <Spacer height={16} />
            <FlexContainer direction="vertical" secondaryAlign="start">
              {r.status === 'Open Request' ? (
                <Text color="green" bold>
                  NOT COMPLETED
                </Text>
              ) : (
                <Text color="green" bold>
                  COMPLETED
                </Text>
              )}

              <Text type="section-header">{r.title}</Text>
            </FlexContainer>
            <Spacer height={16} />
            <FlexContainer primaryAlign="start">
              <img src="/profile_placeholder.png" alt="request owner" />
              {/* <GetProfilePhoto r={r} /> */}
              <Spacer />
              <FlexContainer direction="vertical" secondaryAlign="start">
                <GetProfileFullName r={r} />
                <Text>{r.school}</Text>
              </FlexContainer>
            </FlexContainer>
            <Spacer height={16} />
            <Text>{r.description}</Text>
          </FlexContainer>

          <FlexContainer direction="vertical">
            <Spacer height={16} />
            <Button size="large" color="green">
              Accept
            </Button>
            <Spacer height={16} />
            <Link to={`/requests/${request_id}/chat`}>
              <Button type="secondary" color="green" fullWidth>
                <Text bold color="green">
                  Message <GetProfile r={r} />
                </Text>
              </Button>
            </Link>
          </FlexContainer>
        </FlexContainer>
      )}
    </main>
  )
}

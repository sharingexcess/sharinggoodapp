import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFirestore } from 'hooks/useFirestore'
import {
  FlexContainer,
  Text,
  Spacer,
  Button,
} from '@sharingexcess/designsystem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faLocationDot,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { COLLECTIONS, STATUSES } from 'helpers'
import { useAuth } from 'hooks'
import { Page } from 'components'

export function Requests() {
  const navigate = useNavigate()
  const requests = useFirestore(COLLECTIONS.REQUESTS)
  const [filter, setFilter] = useState(STATUSES.OPEN)
  const { profile } = useAuth()

  useEffect(() => {
    if ([STATUSES.PENDING, STATUSES.COMPLETED].includes(filter) && !profile) {
      navigate('/login')
    }
  }, [filter, profile, navigate])

  function filterRequests(requests) {
    if (filter === 'created') {
      return requests.filter(
        r => r.owner_id === profile?.id && r.status !== STATUSES.COMPLETED
      )
    } else if (filter === STATUSES.OPEN) {
      return requests.filter(r => r.status === STATUSES.OPEN)
    } else if (filter === STATUSES.PENDING) {
      return requests.filter(
        r =>
          r.status === STATUSES.PENDING &&
          (r.donor_id === profile?.id || r.owner_id === profile?.id)
      )
    } else if (filter === STATUSES.COMPLETED) {
      return requests.filter(
        r =>
          r.status === STATUSES.COMPLETED &&
          (r.donor_id === profile?.id || r.owner_id === profile?.id)
      )
    }
  }

  function Request({ r }) {
    const owner = useFirestore(COLLECTIONS.PROFILES, r.owner_id)
    return r && owner ? (
      <Link
        to={`/requests/${r.id}`}
        key={r.id}
        style={{ textDecoration: 'none', width: '100%' }}
      >
        <FlexContainer
          className="Request"
          direction="vertical"
          primaryAlign="start"
          secondaryAlign="start"
          fullWidth
        >
          <Text type="section-header" classList={['Request-title']}>
            {r.title}
          </Text>
          <Spacer height={4} />
          <FlexContainer primaryAlign="start">
            {owner.location && (
              <Text color="green" classList={['Request-location']}>
                <FontAwesomeIcon icon={faLocationDot} />
                <Spacer width={8} />
                {owner.location}
              </Text>
            )}
            {owner.school && (
              <Text color="black" classList={['Request-school']}>
                <FontAwesomeIcon icon={faBuilding} />
                <Spacer width={8} />
                {owner.school}
              </Text>
            )}
          </FlexContainer>
          <Spacer height={4} />
          <Text type="small" color="grey" classList={['Request-description']}>
            {r.description}
          </Text>
        </FlexContainer>
      </Link>
    ) : null
  }

  const filtered_requests = filterRequests(requests)

  return (
    <Page id="Requests">
      <FlexContainer direction="vertical" secondaryAlign="start" fullWidth>
        <FlexContainer primaryAlign="space-between">
          <Text type="secondary-header" align="left">
            Requests
          </Text>
          {profile && profile.permission_level >= 3 && (
            <Link to="/create-request">
              <FontAwesomeIcon
                className="Requests-plus"
                icon={faPlusCircle}
                id="green"
                size="2x"
              />
            </Link>
          )}
        </FlexContainer>
        <Spacer height={16} />
        <FlexContainer primaryAlign="start" id="Requests-filters">
          {profile && profile.permission_level >= 3 && (
            <>
              <Button
                size="small"
                color="green"
                type={filter === 'created' ? 'primary' : 'secondary'}
                handler={() => setFilter('created')}
              >
                Created
              </Button>
              <Spacer width={4} />
            </>
          )}
          <Button
            size="small"
            color="green"
            type={filter === STATUSES.OPEN ? 'primary' : 'secondary'}
            handler={() => setFilter(STATUSES.OPEN)}
          >
            Open
          </Button>
          <Spacer width={4} />
          <Button
            size="small"
            color="green"
            type={filter === STATUSES.PENDING ? 'primary' : 'secondary'}
            handler={() => setFilter(STATUSES.PENDING)}
          >
            Pending
          </Button>
          <Spacer width={4} />
          <Button
            size="small"
            color="green"
            type={filter === STATUSES.COMPLETED ? 'primary' : 'secondary'}
            handler={() => setFilter(STATUSES.COMPLETED)}
          >
            Completed
          </Button>
        </FlexContainer>
        <Spacer height={16} />
        {requests ? (
          filtered_requests.length ? (
            filtered_requests.map(request => (
              <Request key={request.id} r={request} />
            ))
          ) : (
            <FlexContainer direction="vertical">
              <Spacer height={96} />
              <Text type="section-header" color="grey">
                All clear!
              </Text>
              <Spacer height={8} />
              <Text type="small" color="grey" align="center">
                It looks like there are no requests that match your current
                search.
              </Text>
            </FlexContainer>
          )
        ) : null}
      </FlexContainer>
    </Page>
  )
}

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
import { faLocationDot, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { COLLECTIONS, STATUSES } from 'helpers'
import { useAuth } from 'hooks'

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
        r => r.owner_id === profile.id && r.status !== STATUSES.COMPLETED
      )
    } else if (filter === STATUSES.OPEN) {
      return requests.filter(r => r.status === STATUSES.OPEN)
    } else if (filter === STATUSES.PENDING) {
      return requests.filter(
        r => r.status === STATUSES.PENDING && r.donor_id === profile.id
      )
    } else if (filter === STATUSES.COMPLETED) {
      return requests.filter(
        r => r.status === STATUSES.COMPLETED && r.donor_id === profile.id
      )
    }
  }

  function Request({ r }) {
    return (
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
          <FlexContainer direction="horizontal" primaryAlign="start">
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: '#4EA528', fontSize: 12 }}
            />
            <Spacer width={8}></Spacer>
            <Text type="subheader" color="green">
              {r.school}
            </Text>
          </FlexContainer>
          <Spacer height={4} />
          <Text type="small" color="grey" classList={['Request-description']}>
            {r.description}
          </Text>
        </FlexContainer>
      </Link>
    )
  }

  return (
    <div id="Requests">
      <FlexContainer direction="vertical" secondaryAlign="start" fullWidth>
        <Spacer height={24} />
        <FlexContainer primaryAlign="space-between">
          <Text type="primary-header" align="left">
            Requests
          </Text>
          {profile && profile.permission_level >= 3 && (
            <Link to="/create-request">
              <FontAwesomeIcon icon={faPlusCircle} id="green" size="2x" />
            </Link>
          )}
        </FlexContainer>
        <Spacer height={8} />
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
        {requests &&
          filterRequests(requests).map(request => (
            <Request key={request.id} r={request} />
          ))}
      </FlexContainer>
    </div>
  )
}

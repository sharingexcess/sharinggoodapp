import React, { useState } from 'react'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useParams } from 'react-router'
import { useAuth, useFirestore } from 'hooks'
import { Loading } from 'components/Loading/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import {
  handleImageFallback,
  DEFAULT_PROFILE_IMG,
  setFirestoreData,
  COLLECTIONS,
  STATUSES,
  createTimestamp,
  firestore,
} from 'helpers'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

export function Request() {
  const { request_id } = useParams()
  const r = useFirestore('requests', request_id)
  const owner = useFirestore('profiles', r ? r.owner_id : null)
  const donor = useFirestore('profiles', r ? r.donor_id : null)
  const { profile } = useAuth()
  const [working, setWorking] = useState(false)

  const is_owner = r && profile && profile.id === r.owner_id

  async function handleAccept() {
    await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
      status: STATUSES.PENDING,
      donor_id: profile.id,
      timestamp_accepted: createTimestamp(),
      timestamp_updated: createTimestamp(),
    })
  }

  async function handleComplete() {
    await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
      status: STATUSES.COMPLETED,
      timestamp_completed: createTimestamp(),
      timestamp_updated: createTimestamp(),
    })
  }

  async function handleReopen() {
    if (
      window.confirm(
        `Are you sure you want to reopen this request? You will lose your chat history with ${donor.name}.`
      )
    ) {
      setWorking(true)
      await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
        status: STATUSES.OPEN,
        donor_id: null,
        timestamp_completed: null,
        timestamp_accepted: null,
        timestamp_updated: createTimestamp(),
      })
      const messages = await getDocs(
        query(
          collection(firestore, 'messages'),
          where('request_id', '==', request_id)
        )
      ).then(res => res.docs.map(doc => doc.data()))
      await Promise.all(
        messages
          .map(message => [
            setFirestoreData(
              COLLECTIONS.ARCHIVED_MESSAGES,
              message.id,
              message
            ),
            deleteDoc(doc(firestore, COLLECTIONS.MESSAGES, message.id)),
          ])
          .reduce((total, curr) => [...total, ...curr])
      )
      setWorking(false)
    }
  }

  return (
    <main id="Request">
      {!r || !owner || working ? (
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
              <Text type="section-header">Request</Text>
              <Spacer />
              <Spacer />
            </FlexContainer>

            <Spacer height={32} />

            <FlexContainer direction="vertical" secondaryAlign="start">
              <Text color="green" type="small-header">
                {r.status.toUpperCase()} REQUEST
              </Text>

              <Spacer height={8} />

              <Text type="secondary-header">{r.title}</Text>
            </FlexContainer>

            <Spacer height={32} />

            <FlexContainer primaryAlign="start">
              <img
                src={
                  owner && owner.photoURL
                    ? owner.photoURL
                    : '/profile_placeholder.png'
                }
                onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
                alt=""
              />
              <Spacer />
              <FlexContainer direction="vertical" secondaryAlign="start">
                <Text type="small" color="grey">
                  submitted by
                </Text>
                <Text bold>{owner.name}</Text>
                <Text type="small" color="grey">
                  {owner.school}
                </Text>
              </FlexContainer>
            </FlexContainer>
            {r.donor_id && (
              <>
                <Spacer height={24} />
                <FlexContainer primaryAlign="start">
                  <img
                    src={
                      donor && donor.photoURL
                        ? donor.photoURL
                        : '/profile_placeholder.png'
                    }
                    onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
                    alt=""
                  />
                  <Spacer />
                  <FlexContainer direction="vertical" secondaryAlign="start">
                    <Text type="small" color="grey">
                      accepted by
                    </Text>
                    <Text bold>{donor.name}</Text>
                    <Text type="small" color="grey">
                      {donor.email}
                    </Text>
                  </FlexContainer>
                </FlexContainer>
              </>
            )}
            <Spacer height={32} />
            <Text>{r.description}</Text>
          </FlexContainer>

          <FlexContainer direction="vertical">
            <Spacer height={16} />
            {r.status === STATUSES.OPEN && !is_owner && (
              <Button
                size="large"
                color="green"
                fullWidth
                handler={handleAccept}
                disabled={is_owner}
              >
                Accept Request
              </Button>
            )}
            {r.status === STATUSES.PENDING && is_owner && (
              <>
                <Button
                  size="large"
                  color="green"
                  fullWidth
                  handler={handleComplete}
                >
                  Mark Completed{' '}
                </Button>
                <Spacer height={8} />
                <Button
                  size="large"
                  color="green"
                  type="secondary"
                  fullWidth
                  handler={handleReopen}
                >
                  Reopen Request
                </Button>
              </>
            )}
            <Spacer height={8} />
            {donor && (
              <Link
                to={`/requests/${request_id}/chat`}
                style={{ width: ' 100%' }}
              >
                <Button size="large" type="secondary" color="green" fullWidth>
                  Message{' '}
                  {is_owner && donor && donor.name
                    ? donor.name.split(' ')[0]
                    : owner && owner.name
                    ? owner.name.split(' ')[0]
                    : 'Teacher'}
                </Button>
              </Link>
            )}
          </FlexContainer>
        </FlexContainer>
      )}
    </main>
  )
}

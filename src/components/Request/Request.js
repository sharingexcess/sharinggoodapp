import React from 'react'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useNavigate, useParams } from 'react-router'
import { useAuth, useFirestore } from 'hooks'
import { Loading, Page, ProfilePhoto } from 'components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import {
  setFirestoreData,
  COLLECTIONS,
  STATUSES,
  createTimestamp,
  generateUniqueId,
} from 'helpers'

export function Request() {
  const navigate = useNavigate()
  const { request_id } = useParams()
  const { profile } = useAuth()
  const r = useFirestore('requests', request_id)
  const conversations = useFirestore(COLLECTIONS.CONVERSATIONS)
  const owner = useFirestore('profiles', r ? r.owner_id || null : null)
  const donor = useFirestore('profiles', r ? r.donor_id || null : null)

  const is_owner = r && profile && profile.id === r.owner_id

  async function handleAccept() {
    if (!profile) {
      navigate('/login')
      return
    }
    await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
      status: STATUSES.PENDING,
      donor_id: profile?.id,
      timestamp_accepted: createTimestamp(),
      timestamp_updated: createTimestamp(),
    })
    const conversation_id = await getConversationId()
    const message_id = await generateUniqueId(COLLECTIONS.MESSAGES)
    const message = {
      id: message_id,
      conversation_id,
      sender_id: null,
      text: `${profile.name} accepted the request "${r.title}". Woohoo! Feel free to use this space to discus details and logistics 😊`,
      timestamp_created: createTimestamp(),
      timestamp_seen: null,
      link_to: `/requests/${request_id}`,
    }
    await setFirestoreData(COLLECTIONS.MESSAGES, message_id, message)
    navigate(`/messages/${conversation_id}`)
  }

  async function handleComplete() {
    await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
      status: STATUSES.COMPLETED,
      timestamp_completed: createTimestamp(),
      timestamp_updated: createTimestamp(),
    })
    const conversation_id = await getConversationId()
    const message_id = await generateUniqueId(COLLECTIONS.MESSAGES)
    const message = {
      id: message_id,
      conversation_id,
      sender_id: null,
      text: `${owner.name} marked the request "${r.title}" completed! You did it! Thank you for Sharing Good 💚`,
      timestamp_created: createTimestamp(),
      timestamp_seen: null,
      link_to: `/requests/${request_id}`,
    }
    await setFirestoreData(COLLECTIONS.MESSAGES, message_id, message)
    navigate(`/messages/${conversation_id}`)
  }

  async function handleReopen() {
    if (window.confirm(`Are you sure you want to reopen this request?`)) {
      await setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
        status: STATUSES.OPEN,
        donor_id: null,
        timestamp_completed: null,
        timestamp_accepted: null,
        timestamp_updated: createTimestamp(),
      })
      const conversation_id = await getConversationId()
      const message_id = await generateUniqueId(COLLECTIONS.MESSAGES)
      const message = {
        id: message_id,
        conversation_id,
        sender_id: null,
        text: `${owner.name} reopened the request "${r.title}".`,
        timestamp_created: createTimestamp(),
        timestamp_seen: null,
        link_to: `/requests/${request_id}`,
      }
      await setFirestoreData(COLLECTIONS.MESSAGES, message_id, message)
      navigate(`/messages/${conversation_id}`)
    }
  }

  function handleHideRequest() {
    if (
      window.confirm(
        'Are you sure you want to hide this request? You will need to contact the tech team to recover a hidden request.'
      )
    ) {
      setFirestoreData(COLLECTIONS.REQUESTS, request_id, {
        is_hidden: true,
      }).then(() => navigate('/requests'))
    }
  }

  async function getConversationId() {
    const recipient = is_owner ? donor : owner
    const existing_conversation = conversations.find(i =>
      i.profiles.includes(recipient.id)
    )
    if (existing_conversation) {
      return existing_conversation.id
    } else {
      // make an ID that will be consistent between 2 people e.g profile1_profile2
      // make sure it does not also do profile2_profile1
      // e.g. always put in alphabetical order
      const alphabetic_order = recipient.id.localCompare(profile.id)
      const [first_id, second_id] =
        alphabetic_order === -1
          ? [recipient.id, profile.id]
          : [profile.id, recipient.id]
      const id = first_id + '_' + second_id
      // const id = await generateUniqueId(COLLECTIONS.CONVERSATIONS)
      await setFirestoreData(COLLECTIONS.CONVERSATIONS, id, {
        id,
        profiles: [recipient.id, profile.id],
        timestamp_created: createTimestamp(),
      })
      return id
    }
  }

  async function handleOpenMessages() {
    if (!profile) {
      navigate('/login')
      return
    }
    const recipient = is_owner ? donor : owner
    const existing_conversation = conversations.find(i =>
      i.profiles.includes(recipient.id)
    )
    if (existing_conversation) {
      navigate(`/messages/${existing_conversation.id}`)
    } else {
      const alphabetic_order = recipient.id.localCompare(profile.id)
      const [first_id, second_id] =
        alphabetic_order === -1
          ? [recipient.id, profile.id]
          : [profile.id, recipient.id]
      const id = first_id + '_' + second_id
      // const id = await generateUniqueId(COLLECTIONS.CONVERSATIONS)
      await setFirestoreData(COLLECTIONS.CONVERSATIONS, id, {
        id,
        profiles: [recipient.id, profile.id],
        timestamp_created: createTimestamp(),
      })
      navigate(`/messages/${id}`)
    }
  }

  return (
    <Page id="Request">
      {!r || !owner || (r.donor_id && !donor) ? (
        <Loading />
      ) : (
        <FlexContainer direction="vertical" primaryAlign="start">
          <FlexContainer direction="vertical" secondaryAlign="start">
            <FlexContainer primaryAlign="space-between">
              <Link to="/requests">
                <FontAwesomeIcon
                  className="Request-back"
                  icon={faArrowLeft}
                  id="green"
                />
              </Link>
              <Spacer />
              <Text type="section-header">Request</Text>
              <Spacer />
              <Spacer />
            </FlexContainer>

            <Spacer height={32} />

            <FlexContainer direction="vertical" secondaryAlign="start">
              <Text color="green" type="small-header">
                {is_owner ? 'YOUR ' : ''}
                {r.status.toUpperCase()} REQUEST
              </Text>

              <Spacer height={8} />

              <Text type="secondary-header">{r.title}</Text>
            </FlexContainer>

            <Spacer height={32} />

            <FlexContainer primaryAlign="start">
              <ProfilePhoto profile={owner} />
              <Spacer />
              <FlexContainer direction="vertical" secondaryAlign="start">
                <Text type="small" color="grey">
                  submitted by
                </Text>
                <Text bold>{owner.name}</Text>
                <Text type="small" color="grey">
                  {owner.location || 'no listed location'} -{' '}
                  {owner.school || 'no listed school'}
                </Text>
              </FlexContainer>
            </FlexContainer>
            {r.donor_id && (
              <>
                <Spacer height={24} />
                <FlexContainer primaryAlign="start">
                  <ProfilePhoto profile={donor} />
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
            <Spacer height={24} />
            {((donor && is_owner) || (owner && !is_owner)) && (
              <Button
                size="large"
                type="primary"
                color="green"
                fullWidth
                handler={handleOpenMessages}
              >
                Open Messages
              </Button>
            )}
            <Spacer height={8} />
            {r.status === STATUSES.PENDING && is_owner && (
              <>
                <Button
                  size="large"
                  color="green"
                  type="secondary"
                  fullWidth
                  handler={handleComplete}
                >
                  Mark Completed{' '}
                </Button>
                <Spacer height={24} />
                <Button
                  size="large"
                  color="green"
                  type="tertiary"
                  fullWidth
                  handler={handleReopen}
                >
                  Reopen Request
                </Button>
              </>
            )}
            {profile?.permission_level >= 5 && (
              <>
                <Spacer height={32} />
                <Text type="section-header" color="grey">
                  Admin Actions
                </Text>
                <Spacer height={4} />
                <Text type="small" color="grey" align="center">
                  Only admins can see the following options.
                </Text>
                <Spacer height={24} />
                <Button size="large" color="black" handler={handleHideRequest}>
                  Hide Request
                </Button>
                <Spacer height={8} />
                <Text type="small" color="grey" align="center">
                  Hiding a request will hide it from public view, but keep it in
                  the database to be reviewed later.
                </Text>
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      )}
    </Page>
  )
}

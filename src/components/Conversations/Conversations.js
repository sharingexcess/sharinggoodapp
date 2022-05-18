import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProfilePhoto, Page } from 'components'
import { useAuth, useFirestore } from 'hooks'
import {
  Button,
  Card,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { COLLECTIONS, firestore } from 'helpers'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, query, where } from 'firebase/firestore'

export function Conversations() {
  const { profile } = useAuth()
  const conversations = useFirestore(COLLECTIONS.CONVERSATIONS)
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  function sortMessages(array) {
    return array.sort(
      (a, b) => b.timestamp_created.toDate() - a.timestamp_created.toDate()
    )
  }

  function Conversation({ conversation }) {
    const recipient_id = conversation.profiles.find(i => i !== profile.id)
    const recipient = useFirestore(COLLECTIONS.PROFILES, recipient_id)
    const [messages] = useCollectionData(
      query(
        collection(firestore, 'messages'),
        where('conversation_id', '==', conversation.id)
      )
    )

    const last_message =
      messages && messages.length ? sortMessages(messages)[0] : null

    if (!last_message) return null

    const new_messages =
      last_message.sender_id !== profile.id && !last_message.timestamp_seen

    return recipient &&
      (!search ||
        recipient.name.toLowerCase().includes(search.toLowerCase())) ? (
      <Link
        key={recipient.id}
        className="wrapper"
        to={`/messages/${conversation.id}`}
      >
        <Card classList={['Conversation']}>
          <ProfilePhoto profile={recipient} className="Profile-icon" />
          <div>
            <Text type="section-header" color="black">
              {new_messages && <Text type="small">🟢</Text>}
              {recipient.name}
            </Text>
            {last_message && (
              <Text
                type="small"
                color={new_messages ? 'black' : 'grey'}
                bold={new_messages}
              >
                {last_message.sender_id === profile.id
                  ? 'You'
                  : recipient.name.split(' ')[0]}
                {': '}
                {last_message.text}
              </Text>
            )}
          </div>
        </Card>
      </Link>
    ) : null
  }

  return !conversations.length ? (
    <Page id="Conversations">
      <Text type="secondary-header" color="black">
        Messages
      </Text>
      <Spacer height={96} />
      <FlexContainer direction="vertical">
        <Text type="section-header" color="grey">
          All clear!
        </Text>
        <Spacer height={8} />
        <Text type="small" color="grey" align="center">
          It looks like you don't have any conversations at the moment.
        </Text>
        <Spacer height={16} />
        <Link to="/profiles">
          <Button type="secondary" color="green">
            Browse Profiles
          </Button>
        </Link>
        <Spacer height={8} />
        <Link to="/requests">
          <Button type="secondary" color="green">
            Browse Requests
          </Button>
        </Link>
      </FlexContainer>
    </Page>
  ) : (
    <Page id="Conversations">
      <Text type="secondary-header" color="black">
        Messages
      </Text>
      <Spacer height={4} />
      <Text type="small" color="grey">
        Get to know the community of Sharing Good!
      </Text>
      <Spacer height={24} />
      <label htmlFor="email">SEARCH</label>
      <input type="text" value={search} onChange={handleSearch} />

      <Spacer height={16} />

      {conversations.map(i => (
        <Conversation conversation={i} key={i.id} />
      ))}
    </Page>
  )
}

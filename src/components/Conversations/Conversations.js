import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loading, ProfilePhoto, Page } from 'components'
import { useAuth, useFirestore } from 'hooks'
import { Card, Spacer, Text } from '@sharingexcess/designsystem'
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
      (a, b) => a.timestamp_created.toDate() - b.timestamp_created.toDate()
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
              {!last_message.timestamp_seen && <Text type="small">🟢</Text>}
              {recipient.name}
            </Text>
            {last_message && (
              <Text
                type="small"
                color={last_message.timestamp_seen ? 'black' : 'grey'}
                bold={!last_message.timestamp_seen}
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
    <Loading text="Loading messages" />
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

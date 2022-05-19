import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { collection, query, where } from 'firebase/firestore'
import { Loading, Error, Page } from 'components'
import { useAuth, useFirestore } from 'hooks'
import { Link } from 'react-router-dom'
import { Navigate, useParams } from 'react-router'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  createTimestamp,
  firestore,
  formatTimestamp,
  generateUniqueId,
  setFirestoreData,
  COLLECTIONS,
} from 'helpers'
import { ProfilePhoto } from 'components/ProfilePhoto/ProfilePhoto'

export function Conversation() {
  const { user, profile } = useAuth()
  const inputElement = useRef(null)

  const { conversation_id } = useParams()
  const conversation = useFirestore(COLLECTIONS.CONVERSATIONS, conversation_id)
  const [messages = [], loading] = useCollectionData(
    query(
      collection(firestore, 'messages'),
      where('conversation_id', '==', conversation_id)
    )
  )
  const recipient = useFirestore(
    'profiles',
    conversation ? conversation.profiles.find(i => i !== profile.id) : null
  )
  const [inputValue, setInputValue] = useState('')
  const [activeMessage, setActiveMessage] = useState(null)

  useEffect(() => {
    inputElement.current.onfocus = () => {
      window.scrollTo(0, 0)
      document.body.scrollTop = 0
    }
  })

  useEffect(() => {
    const chat = document.getElementById('Conversation-messages')
    if (chat) chat.scrollTop = 9999

    // handle sending read receipts
    for (const message of messages.filter(
      m => m.sender_id && m.sender_id !== profile.id
    )) {
      if (!message.timestamp_seen) {
        setFirestoreData(COLLECTIONS.MESSAGES, message.id, {
          timestamp_seen: createTimestamp(),
        })
      }
    }
  }, [messages, profile])

  function updateActiveMessage(message_id) {
    setActiveMessage(curr => (message_id === curr ? null : message_id))
  }

  async function send() {
    const id = await generateUniqueId('messages')
    setFirestoreData('messages', id, {
      id,
      conversation_id,
      sender_id: profile.id,
      text: inputValue,
      timestamp_created: createTimestamp(),
      timestamp_seen: null,
    })
    setInputValue('')
  }

  function sortMessages(array) {
    return array.sort(
      (a, b) => a.timestamp_created.toDate() - b.timestamp_created.toDate()
    )
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && inputValue) {
      send()
    }
  }

  if (conversation && profile && !conversation.profiles.includes(profile.id)) {
    return <Navigate to="/messages" />
  }

  if (!user) {
    return <Error message="You do not have permission to view this chat" />
  }

  return (
    <Page id="Conversation">
      <FlexContainer id="Conversation-header" primaryAlign="space-between">
        <Link to={`/messages`}>
          <FontAwesomeIcon
            className="Conversation-back"
            icon={faArrowLeft}
            id="green"
          />
        </Link>
        <Spacer />
        <Text
          id="Conversation-request-title"
          type="section-header"
          align="center"
        >
          {recipient
            ? `Chat with ${recipient.name.split(' ')[0]}`
            : 'Loading...'}
        </Text>
        <Spacer />
        <Spacer />
      </FlexContainer>
      <FlexContainer
        direction="vertical"
        primaryAlign="start"
        id="Conversation-messages"
      >
        {loading ? (
          <Loading />
        ) : !messages.length && !loading ? (
          <FlexContainer direction="vertical">
            <Spacer height={96} />
            <Text type="section-header" color="grey">
              Start the conversation!
            </Text>
            <Text color="grey" align="center">
              Every bit of sharing starts with a message :)
            </Text>
          </FlexContainer>
        ) : (
          sortMessages(messages).map(message => {
            let className = message.sender_id
              ? message.sender_id === profile.id
                ? 'Message sent'
                : 'Message received'
              : 'Message notification'
            const is_active = activeMessage === message.id
            className += is_active ? ' active' : ' inactive'
            const sender = message.sender_id
              ? message.sender_id === profile.id
                ? profile
                : recipient
              : null
            return (
              <div
                key={message.id}
                className={className}
                onClick={() => updateActiveMessage(message.id)}
              >
                {sender && (
                  <ProfilePhoto profile={sender} className="MessagePhoto" />
                )}
                <Text classList={['Message-text']}>{message.text}</Text>
                {message.link_to && <Link to={message.link_to}>Open Link</Link>}
                <Text
                  classList={['Message-timestamp']}
                  type="small"
                  color="grey"
                >
                  {message.sender_id ? 'Sent ' : ''}
                  {formatTimestamp(message.timestamp_created, 'ddd M/D, h:mma')}
                  <br />
                  {message.timestamp_seen
                    ? 'Seen ' +
                      formatTimestamp(message.timestamp_seen, ' ddd M/D, h:mma')
                    : message.sender_id
                    ? 'Not Seen'
                    : ''}
                </Text>
              </div>
            )
          })
        )}
      </FlexContainer>
      <FlexContainer id="Conversation-new-message" primaryAlign="space-between">
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={inputElement}
        />
        <Spacer width={16} />
        <Button
          id="Conversation-send"
          disabled={!inputValue}
          handler={send}
          color="blue"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </FlexContainer>
    </Page>
  )
}

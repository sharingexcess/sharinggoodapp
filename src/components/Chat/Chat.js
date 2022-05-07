import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  createTimestamp,
  firestore,
  formatTimestamp,
  generateUniqueId,
  handleImageFallback,
  setFirestoreData,
  DEFAULT_PROFILE_IMG,
} from 'helpers'
import { collection, query, where } from 'firebase/firestore'
import { Loading } from 'components'
import { useAuth, useFirestore } from 'hooks'

export function Chat() {
  const { request_id } = useParams()
  const request = useFirestore('requests', request_id)
  const [messages = [], loading] = useCollectionData(
    query(
      collection(firestore, 'messages'),
      where('request_id', '==', request_id)
    )
  )
  const [inputValue, setInputValue] = useState('')
  const { profile } = useAuth()
  const [recipientId, setRecipientId] = useState()
  const recipient = useFirestore('profiles', recipientId)
  const [activeMessage, setActiveMessage] = useState(null)

  useEffect(() => {
    function findRecipientId() {
      for (const i of messages) {
        if (i.sender_id !== profile.id) {
          setRecipientId(i.sender_id)
          break
        }
      }
    }
    if (messages && profile && !recipientId) {
      findRecipientId()
    }
  }, [messages, profile, recipientId])

  useEffect(() => {
    document.getElementById('Chat-messages').scrollTop = 9999
  }, [messages])

  function updateActiveMessage(message_id) {
    setActiveMessage(curr => (message_id === curr ? null : message_id))
  }

  async function send() {
    const id = await generateUniqueId('messages')
    setFirestoreData('messages', id, {
      id,
      request_id,
      sender_id: profile.id,
      text: inputValue,
      timestamp_created: createTimestamp(),
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

  return (
    <main id="Chat">
      <FlexContainer id="Chat-header" primaryAlign="space-between">
        <Link to={`/requests/${request_id}`}>
          <FontAwesomeIcon icon={faArrowLeft} id="green" />
        </Link>
        <Spacer />
        <Text id="Chat-request-title" type="section-header" align="center">
          {request ? request.title : 'Loading...'}
        </Text>
        <Spacer />
        <Spacer />
      </FlexContainer>
      <FlexContainer
        direction="vertical"
        primaryAlign="start"
        id="Chat-messages"
      >
        {loading ? (
          <Loading />
        ) : (
          sortMessages(messages).map(message => {
            let className =
              message.sender_id === profile.id
                ? 'Message sent'
                : 'Message received'
            const is_active = activeMessage === message.id
            className += is_active ? ' active' : ' inactive'
            return (
              <div
                key={message.id}
                className={className}
                onClick={() => updateActiveMessage(message.id)}
              >
                <div className="MessagePhoto">
                  <img
                    src={
                      message.sender_id === profile.id
                        ? profile.photoURL
                        : (recipient
                            ? recipient.photoURL
                            : DEFAULT_PROFILE_IMG) || DEFAULT_PROFILE_IMG
                    }
                    alt=""
                    onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
                  />
                </div>
                <Text classList={['Message-text']}>{message.text}</Text>
                <Text
                  classList={['Message-timestamp']}
                  type="small"
                  color="grey"
                >
                  {formatTimestamp(
                    message.timestamp_created,
                    'dddd M/D, h:mma'
                  )}
                </Text>
              </div>
            )
          })
        )}
      </FlexContainer>
      <FlexContainer id="Chat-new-message" primaryAlign="space-between">
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Spacer width={16} />
        <Button
          id="Chat-send"
          disabled={!inputValue}
          handler={send}
          color="blue"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </FlexContainer>
    </main>
  )
}

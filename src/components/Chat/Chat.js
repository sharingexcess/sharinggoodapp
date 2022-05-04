import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  FlexContainer,
  Input,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  createTimestamp,
  firestore,
  generateUniqueId,
  setFirestoreData,
} from 'helpers'
import { collection, query, where } from 'firebase/firestore'
import { Loading } from 'components'
import { useAuth, useFirestore } from 'hooks'

export function Chat() {
  const { request_id } = useParams()
  const [messages] = useCollectionData(
    query(
      collection(firestore, 'messages'),
      where('request_id', '==', request_id)
    )
  )
  const [inputValue, setInputValue] = useState('')
  const { profile } = useAuth()

  useEffect(() => {
    document.getElementById('Chat-messages').scrollTop = 9999
  }, [messages])

  function ReceivedMessagePhoto({ m }) {
    const p = useFirestore('profiles', m.sender_id)
    return (
      <div className="Sender-profile">
        {!p ? <Loading /> : <img src={p.photoURL} alt={p.name} />}
      </div>
    )
  }

  function Message({ message }) {
    return (
      <div>
        <p>{message.text}</p>
      </div>
    )
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

  return (
    <main id="Chat" className="page">
      <FlexContainer primaryAlign="space-between">
        <Link to={`/requests/${request_id}`}>
          <FontAwesomeIcon icon={faArrowLeft} id="green" />
        </Link>
        <Spacer />
        <Text>Chat</Text>
        <Spacer />
        <Spacer />
      </FlexContainer>
      <FlexContainer
        direction="vertical"
        primaryAlign="start"
        id="Chat-messages"
      >
        {!messages ? (
          <Loading />
        ) : (
          sortMessages(messages).map(message => (
            <div
              key={message.id}
              className={
                message.sender_id === profile.id
                  ? 'Message sent'
                  : 'Message received'
              }
            >
              {message.sender_id !== profile.id && (
                <ReceivedMessagePhoto m={message} />
              )}
              <Message message={message} />
            </div>
          ))
        )}
      </FlexContainer>
      <FlexContainer id="Chat-new-message" primaryAlign="space-between">
        <Input
          label="Your message..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
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

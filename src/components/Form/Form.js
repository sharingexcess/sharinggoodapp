import React, { useState } from 'react'
import { createTimestamp, generateUniqueId, setFirestoreData } from 'helpers'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'

export function Form() {
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const { profile } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const id = await generateUniqueId('requests')
      const payload = {
        id,
        title: titleValue,
        description: descriptionValue,
        owner_id: profile.id,
        school: profile.school,
        status: 'open',
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      setFirestoreData('requests', id, payload)
      setTitleValue('')
      setDescriptionValue('')
    } catch (error) {
      console.log('Error writing new request to Firestore Database', error)
    }
  }

  return (
    <div className="request-creation page">
      <form id="request-creation-form">
        <FlexContainer direction="vertical">
          <FlexContainer primaryAlign="space-between">
            <Link to="/requests">
              <FontAwesomeIcon icon={faArrowLeft} id="green" />
            </Link>
            <Spacer />
            <Text>Create A Request</Text>
            <Spacer />
            <Spacer />
          </FlexContainer>
          <Spacer height={16} />
          <Text>
            Write a short title and description for your request. Be sure to
            include information about who needs the item and why.
          </Text>
          <Spacer height={16} />
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
          />
          <Spacer height={16} />
          <textarea
            id="description"
            name="description"
            type="text"
            placeholder="Description"
            value={descriptionValue}
            onChange={e => setDescriptionValue(e.target.value)}
            rows={15}
          />

          <Spacer height={16} />
          <Button handler={handleSubmit}>Share</Button>
        </FlexContainer>
      </form>
    </div>
  )
}

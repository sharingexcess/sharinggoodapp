import React, { useState } from 'react'
import { createTimestamp, generateUniqueId, setFirestoreData } from 'helpers'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { Page } from 'components'

export function CreateRequest() {
  const navigate = useNavigate()
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
        is_hidden: false,
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      setFirestoreData('requests', id, payload)
      setTitleValue('')
      setDescriptionValue('')
      navigate(`/requests/${id}`)
    } catch (error) {
      console.error('Error writing new request to Firestore Database', error)
    }
  }

  return (
    <Page id="CreateRequest">
      <form id="request-creation-form">
        <FlexContainer primaryAlign="space-between">
          <Link to="/requests">
            <FontAwesomeIcon icon={faArrowLeft} id="green" />
          </Link>
          <Spacer />
          <Text type="section-header">Create A Request</Text>
          <Spacer />
          <Spacer />
        </FlexContainer>
        <Spacer height={16} />
        <Text type="small" color="grey">
          Use this form to open a request for donors. We recommend organizing
          all donations through your school office so no locations need to be
          shared!
        </Text>
        <Spacer height={24} />
        <label htmlFor="title">TITLE</label>
        <input
          type="text"
          name="title"
          value={titleValue}
          autoFocus
          onChange={event => setTitleValue(event.target.value)}
        />
        <Spacer height={8} />
        <Text type="small" color="grey">
          Your request title, as well as your profile name, school, and location
          will be listed on the 💚 SG home page.
          <br />
          Click <Link to="/profile">here</Link> if you need to update your
          profile.
        </Text>
        <Spacer height={24} />
        <label htmlFor="title">DESCRIPTION</label>
        <textarea
          id="description"
          name="description"
          type="text"
          value={descriptionValue}
          onChange={e => setDescriptionValue(e.target.value)}
          rows={5}
        />
        <Spacer height={8} />
        <Text type="small" color="grey">
          This description should describe the who, what, and why of your
          donation request. Please be sensitive with any personally identifying
          information!
        </Text>
        <Spacer height={32} />
        <Button size="large" color="green" fullWidth handler={handleSubmit}>
          Create Request
        </Button>
      </form>
    </Page>
  )
}

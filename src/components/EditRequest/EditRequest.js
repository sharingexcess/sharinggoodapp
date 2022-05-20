import React, { useEffect, useState } from 'react'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { useNavigate, useParams } from 'react-router'
import { useAuth, useFirestore } from 'hooks'
import { Error, Page } from 'components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { setFirestoreData, createTimestamp } from 'helpers'

export function EditRequest() {
  const navigate = useNavigate()
  const { request_id } = useParams()
  const { profile } = useAuth()
  const r = useFirestore('requests', request_id)

  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const is_owner = r && profile && profile.id === r.owner_id

  useEffect(() => {
    setTitleValue(r?.title)
    setDescriptionValue(r?.description)
  }, [r])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const id = request_id
      const payload = {
        id,
        title: titleValue,
        description: descriptionValue,
        timestamp_updated: createTimestamp(),
      }
      setFirestoreData('requests', id, payload)
      navigate(`/requests/${id}`)
    } catch (error) {
      console.error('Error writing new request to Firestore Database', error)
    }
  }

  if (!is_owner) {
    return <Error message="You do not have permission to view this chat" />
  }

  return (
    <Page id="EditRequest">
      <form id="request-eidt-form">
        <FlexContainer primaryAlign="space-between">
          <Link to="/requests">
            <FontAwesomeIcon
              className="EditRequest-back"
              icon={faArrowLeft}
              id="green"
            />
          </Link>
          <Spacer />
          <Text type="section-header">Edit Your Request</Text>
          <Spacer />
          <Spacer />
        </FlexContainer>
        <Spacer height={16} />
        <Text type="small" color="grey">
          Use this form to edit your request. We recommend organizing all
          donations through your school office so no locations need to be
          shared!
        </Text>
        <Spacer height={32} />
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
        <Spacer height={48} />
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
        <Button
          size="large"
          color="green"
          fullWidth
          handler={handleSubmit}
          disabled={!(titleValue && descriptionValue)}
        >
          Edit Request
        </Button>
      </form>
      <Spacer height={48} />
    </Page>
  )
}

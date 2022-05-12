import React from 'react'
import { Loading, Page } from 'components'
import { Link, useParams } from 'react-router-dom'
import { useAuth, useFirestore } from 'hooks'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import {
  COLLECTIONS,
  createTimestamp,
  generateUniqueId,
  setFirestoreData,
} from 'helpers'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ProfilePhoto } from 'components/ProfilePhoto/ProfilePhoto'

export function Profile() {
  const navigate = useNavigate()
  // to avoid conflict, rename the "profile" we get from useAuth as "auth_profile"
  const { user, profile: auth_profile } = useAuth()
  // get the user id from the current url parameters
  const { id } = useParams()
  // get that users profile from the users collection in firestore
  const profile = useFirestore('profiles', id)
  // profileIconFullUrl will be used to store the full path URL to the user's profile photo
  const conversations = useFirestore(COLLECTIONS.CONVERSATIONS)

  async function handleMessage() {
    const existing_conversation = conversations.find(i =>
      i.profiles.includes(profile.id)
    )
    if (existing_conversation) {
      navigate(`/messages/${existing_conversation.id}`)
    } else {
      const id = await generateUniqueId(COLLECTIONS.CONVERSATIONS)
      await setFirestoreData(COLLECTIONS.CONVERSATIONS, id, {
        id,
        profiles: [profile.id, profile.id],
        timestamp_created: createTimestamp(),
      })
      navigate(`/messages/${id}`)
    }
  }

  if (!profile) return <Loading text="Loading user" />
  return (
    <Page id="Profile">
      <FlexContainer primaryAlign="space-between">
        <Link to="/profiles">
          <FontAwesomeIcon icon={faArrowLeft} id="green" />
        </Link>
        <Spacer />
        <Text type="section-header">Profile</Text>
        <Spacer />
        <Spacer />
      </FlexContainer>

      <Spacer height={32} />
      <ProfilePhoto profile={profile} id="org-icon" />
      <Spacer height={24} />
      <Text type="secondary-header" color="black" align="center">
        {profile.name}
      </Text>
      <Spacer height={4} />
      <Text color="grey">{profile.pronouns}</Text>
      <Spacer height={4} />
      <Text color="black">{profile.email}</Text>
      <Spacer height={4} />
      <Text type="small" color="grey">
        {profile.location || 'no listed location'} -{' '}
        {profile.school || 'no listed school'}
      </Text>
      <Spacer height={32} />
      <Text type="section-header" color="green">
        About {profile.name.split(' ')[0]}
      </Text>
      <Spacer height={16} />
      <Text color="black" type="small">
        {profile.bio}
      </Text>
      <Spacer height={24} />
      {profile.id !== auth_profile.id && (
        <>
          <Button color="green" handler={handleMessage}>
            Message {profile.name.split(' ')[0]}
          </Button>
          <Spacer height={32} />
        </>
      )}

      {auth_profile.permission_level > 3 ? (
        <>
          <Spacer height={32} />
          <Text type="secondary-header" color="grey">
            Admin Actions
          </Text>
          <Text type="small" color="grey">
            Only admins can see the following options.
          </Text>
          <Spacer height={32} />
          {profile.id === user.uid ? (
            <Text align="center">
              This user is you! You cannot change your own permission settings.
            </Text>
          ) : (
            <>
              <Text type="section-header">Permission Level</Text>
              <Spacer height={8} />
              <FlexContainer>
                <Button
                  fullWidth
                  color={profile.permission_level === 1 ? 'green' : 'white'}
                  handler={() =>
                    setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                      permission_level: 1,
                    })
                  }
                >
                  Basic
                </Button>
                <Button
                  fullWidth
                  color={profile.permission_level === 3 ? 'green' : 'white'}
                  handler={() =>
                    setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                      permission_level: 3,
                    })
                  }
                >
                  Teacher
                </Button>
                <Button
                  fullWidth
                  color={profile.permission_level === 5 ? 'green' : 'white'}
                  handler={() =>
                    setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                      permission_level: 5,
                    })
                  }
                >
                  Admin
                </Button>
                <Button
                  fullWidth
                  color={profile.permission_level === 9 ? 'green' : 'white'}
                  handler={() =>
                    setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                      permission_level: 9,
                    })
                  }
                >
                  Moderator
                </Button>
              </FlexContainer>
              <Spacer height={32} />

              <Text type="section-header">Profile Moderation</Text>
              {profile.is_disabled ? (
                <>
                  <Text type="small">This user has been blocked.</Text>
                  <Spacer height={16} />
                  <Button
                    type="primary"
                    color="black"
                    handler={() =>
                      setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                        is_disabled: false,
                      })
                    }
                  >
                    🚨 Unblock this user
                  </Button>
                </>
              ) : (
                <>
                  <Text type="small">
                    This user currently has standard access.
                  </Text>
                  <Spacer height={16} />
                  <Button
                    type="primary"
                    color="black"
                    handler={() =>
                      setFirestoreData(COLLECTIONS.PROFILES, profile.id, {
                        is_disabled: true,
                      })
                    }
                  >
                    🚨 Block this user
                  </Button>
                </>
              )}
            </>
          )}
        </>
      ) : null}
    </Page>
  )
}

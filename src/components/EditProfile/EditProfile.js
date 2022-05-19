import { useMemo, useState } from 'react'
import { auth, createTimestamp, firestore, storage } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'firebase/storage'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { Ellipsis } from 'components/Ellipsis/Ellipsis'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { ProfilePhoto } from 'components/ProfilePhoto/ProfilePhoto'
import { Page } from 'components/Page/Page'
import { useNavigate } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth'

export function EditProfile() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [values, setValues] = useState({
    name: profile ? profile.name || '' : '',
    pronouns: profile ? profile.pronouns || '' : '',
    location: profile ? profile.location || '' : '',
    school: profile ? profile.school || '' : '',
    bio: profile ? profile.bio || '' : '',
  })
  const [uploadFile] = useUploadFile()
  const [fileUpload, setFileUpload] = useState()
  const [working, setWorking] = useState(false)

  const modified_profile = useMemo(() => {
    if (fileUpload) {
      return { ...profile, photoURL: URL.createObjectURL(fileUpload) }
    } else return profile
  }, [profile, fileUpload])

  const uploadProfilePhoto = async () => {
    const extension = fileUpload.name.split('.').pop()
    const path = 'profile_photos/' + user.uid + '.' + extension
    const fileRef = ref(storage, path)
    await uploadFile(fileRef, fileUpload, {
      contentType: fileUpload.type, // pull content type from file
    })
    return path
  }

  async function handleSubmit() {
    try {
      setWorking(true)
      let uploaded_photo_path

      if (fileUpload) {
        uploaded_photo_path = await uploadProfilePhoto()
      }
      const payload = {
        ...values,
        uploaded_photo_path:
          uploaded_photo_path || profile.uploaded_photo_path || null,
        timestamp_updated: createTimestamp(),
      }
      const profileRef = doc(collection(firestore, 'profiles'), user.uid)
      await setDoc(profileRef, payload, { merge: true })
      setWorking(false)
      navigate('/requests')
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  function handleFileChange(e) {
    if (e.target.files[0]) setFileUpload(e.target.files[0])
  }

  function handleResetPassword() {
    if (window.confirm('Are you sure you want to reset your password?')) {
      sendPasswordResetEmail(auth, profile.email)
        .then(() =>
          window.alert(
            `An email has been sent to ${profile.email} with instructions on how to reset your password.`
          )
        )
        .catch(e => console.error(e))
    }
  }

  return (
    <Page id="EditProfile">
      <Text type="secondary-header" color="black">
        Edit Profile
      </Text>
      <Spacer height={8} />
      <Text type="small" color="grey">
        Your profile controls how you appear to other members of Sharing Good.
        Tell us more about yourself to help build a community of trust and
        safety!
      </Text>
      <Spacer height={32} />
      <FlexContainer id="EditProfile-photo">
        <ProfilePhoto profile={modified_profile} id="EditProfile-curr-photo" />
        <input
          id="EditProfile-photo-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="EditProfile-photo-upload" id="EditProfile-edit-photo">
          <FontAwesomeIcon icon={faEdit} size="1x" />
        </label>
      </FlexContainer>
      <Spacer height={16} />
      <Text type="section-header" color="black" align="center">
        {user.email}
      </Text>
      <Spacer height={8} />
      <Button
        type="tertiary"
        color="green"
        fullWidth
        handler={handleResetPassword}
      >
        Change Password
      </Button>
      <Spacer height={32} />
      <div className="profile-creation-form-field">
        <label htmlFor="name">NAME </label>
        <input
          type="text"
          name="name"
          id="name"
          value={values.name}
          label="name"
          onChange={handleInputChange}
        />
      </div>
      <div className="profile-creation-form-field">
        <label htmlFor="location">PRONOUNS </label>
        <input
          type="text"
          name="pronouns"
          id="pronouns"
          value={values.pronouns}
          label="pronouns"
          onChange={handleInputChange}
        />
      </div>
      <div className="profile-creation-form-field">
        <label htmlFor="location">LOCATION </label>
        <input
          type="text"
          name="location"
          id="location"
          value={values.location}
          label="location"
          onChange={handleInputChange}
        />
      </div>
      {profile.permission_level > 1 && (
        <div className="profile-creation-form-field">
          <label htmlFor="school">SCHOOL </label>
          <input
            type="text"
            name="school"
            id="school"
            value={values.school}
            label="school"
            onChange={handleInputChange}
          />
        </div>
      )}
      <div className="profile-creation-form-field">
        <label htmlFor="bio" style={{ textAlign: 'end' }}>
          ABOUT
        </label>
        <textarea
          type="text"
          name="bio"
          id="bio"
          value={values.bio}
          label="bio"
          rows={3}
          onChange={handleInputChange}
        />
      </div>
      <Button
        type="primary"
        size="large"
        fullWidth
        color="green"
        handler={handleSubmit}
        disabled={working}
      >
        {working ? (
          <>
            Saving Changes
            <Ellipsis />
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </Page>
  )
}

import { useMemo, useState } from 'react'
import { createTimestamp, firestore, storage } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'
import {
  Button,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { ref } from 'firebase/storage'
import { Ellipsis, Page, ProfilePhoto } from 'components'

export function CreateProfile() {
  const { user } = useAuth()
  const [values, setValues] = useState({
    permission_level: 1,
    name: user.displayName || '',
    pronouns: '',
    location: '',
    school: '',
    bio: '',
  })
  const [uploadFile] = useUploadFile()
  const [fileUpload, setFileUpload] = useState()
  const [working, setWorking] = useState(false)

  const profile = useMemo(() => {
    if (fileUpload) {
      return { photoURL: URL.createObjectURL(fileUpload) }
    } else return user
  }, [user, fileUpload])

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
        id: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        uploaded_photo_path: uploaded_photo_path || null,
        is_disabled: false,
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      const profileRef = doc(collection(firestore, 'profiles'), user.uid)
      await setDoc(profileRef, payload)
      setWorking(false)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: name === 'permission_level' ? parseInt(value) : value,
    })
  }

  function handleFileChange(e) {
    if (e.target.files[0]) setFileUpload(e.target.files[0])
  }

  function isFormComplete() {
    return (
      values.name &&
      values.pronouns &&
      values.location &&
      values.bio &&
      (values.permission_level < 3 || values.school) // if your permission is less than 3, you don't need a school
    )
  }

  return (
    <Page id="CreateProfile">
      <Text type="secondary-header" color="black">
        Create Your Profile
      </Text>
      <Spacer height={8} />
      <Text type="small" color="grey">
        Tell us a little more about yourself! This will help others learn who
        you are, and help support each other in a safe and trusting environment.
      </Text>
      <Spacer height={32} />
      <FlexContainer id="CreateProfile-photo">
        <ProfilePhoto profile={profile} id="CreateProfile-curr-photo" />
        <input
          id="CreateProfile-photo-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="CreateProfile-photo-upload"
          id="CreateProfile-edit-photo"
        >
          <FontAwesomeIcon icon={faEdit} size="1x" />
        </label>
      </FlexContainer>
      <Spacer height={16} />
      <Text type="section-header" color="black" align="center" fullWidth>
        {user.email}
      </Text>
      <div className="profile-creation-form-field">
        <label htmlFor="name">I AM A ... </label>
        <FlexContainer primaryAlign="space-around">
          <Button
            color="green"
            type={values.permission_level === 1 ? 'primary' : 'secondary'}
            handler={() =>
              setValues(curr => ({ ...curr, permission_level: 1 }))
            }
          >
            Donor
          </Button>
          <Button
            color="green"
            type={values.permission_level === 3 ? 'primary' : 'secondary'}
            handler={() =>
              setValues(curr => ({ ...curr, permission_level: 3 }))
            }
          >
            Teacher
          </Button>
        </FlexContainer>
      </div>
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
      {values.permission_level > 1 && (
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
        disabled={working || !isFormComplete()}
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

import { useEffect, useState } from 'react'
import { createTimestamp, firestore, storage } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
// storage
import { ref } from 'firebase/storage'
import { useUploadFile } from 'react-firebase-hooks/storage'

export function EditProfile() {
  const { profile, user } = useAuth()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [photoURL, setPhotoURL] = useState(user.photoURL)

  const initialValues = {
    name: profile.name,
    school: profile.school,
    bio: profile.bio,
  }

  const [values, setValues] = useState(initialValues)

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = {
        ...values,
        timestamp_updated: createTimestamp(),
      }
      const profileRef = doc(collection(firestore, 'profiles'), profile.id)
      await setDoc(profileRef, payload, { merge: true })
    } catch (error) {
      console.error('Error writing new profile to Firestore Database', error)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  function handleChange(e) {
    if (e.target.files[0]) setPhoto(e.target.files[0])
  }
  function handleClick() {
    upload(photo, user, setLoading)
  }

  // STORAGE
  const [uploadFile, uploading, snapshot, error] = useUploadFile()
  const fileRef = ref(storage, 'photos/' + user.uid + '.png') // pull file extension from os
  const [selectedFile, setSelectedFile] = useState()

  const upload = async () => {
    if (selectedFile) {
      await uploadFile(fileRef, selectedFile, {
        contentType: 'image/png', // pull content type from file
      })
      // setFirestoreData('profiles', profile.id, { uploaded_photo_path: result.ROGHE_FILL_THIS_OUT })
    }
  }
  // STORAGE

  useEffect(() => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL)
    }
  }, [user])

  return (
    <div id="Profile">
      <div id="edit-header">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} size="2x" id="green" />
        </Link>
        {/* UPLOAD */}
        {error && <strong>Error: {error.message}</strong>}
        {uploading && <span>Uploading file...</span>}
        {selectedFile && <span>Selected file: {selectedFile.name}</span>}
        <input
          type="file"
          accept=".png, .jpeg, .jpg" // add extension for apple and look for other extensions
          onChange={e => {
            const file = e.target.files ? e.target.files[0] : undefined
            setSelectedFile(file)
          }}
        />
        <button style={{ cursor: 'pointer' }} onClick={upload}>
          Upload file
        </button>
        {/* UPLOAD */}
      </div>
      <h2>Edit Profile</h2>
      <div className="profile-image-container">
        <input type="file" onChange={handleChange} />
        <img src={photoURL} alt={profile.name} onClick={handleClick} />
        <FontAwesomeIcon
          icon={faPen}
          size="2x"
          id="green"
          className="profile-image-edit-button"
        />
      </div>
      <aside>{profile.email}</aside>
      <form id="edit-profile-form">
        <div className="profile-edit-form-field">
          <label htmlFor="name">NAME</label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            label="name"
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-edit-form-field">
          <label htmlFor="school">SCHOOL</label>
          <input
            type="text"
            name="school"
            id="school"
            value={values.school}
            label="school"
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-edit-form-field">
          <label htmlFor="bio" style={{ textAlign: 'end' }}>
            ABOUT
          </label>
          <textarea
            type="text"
            name="bio"
            id="bio"
            value={values.bio}
            label="bio"
            rows={7}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleSubmit}>
          <h3>Save Changes</h3>
        </button>
      </form>
    </div>
  )
}

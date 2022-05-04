import { useState } from 'react'
import { createTimestamp, firestore } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export function EditProfile() {
  const { profile } = useAuth()

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
      console.log('Error writing new profile to Firestore Database', error)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  function handleChange() {}
  function handleClick() {}

  return (
    <div id="profile-edit" className="page">
      <div id="edit-header">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} size="2x" id="green" />
        </Link>
        <h2>Edit Profile</h2>
      </div>
      <div className="profile-image-container">
        <input type="file" onChange={handleChange} />
        <img
          src={'/profile_placeholder.png'}
          alt={profile.name}
          onClick={handleClick}
        />
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

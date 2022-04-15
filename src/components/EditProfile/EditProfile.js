import { useState } from 'react'
import { createTimestamp, firestore } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
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

  return (
    <div className="profile-edit page">
      <div id="edit-header">
        <div className="edit-header-col-1">
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" id="green" />
          </Link>
        </div>
        <div className="edit-header-col-2">
          <h1>Edit Profile</h1>
        </div>
        <div className="edit-header-col-3"></div>
      </div>
      <img src={'/profile_placeholder.png'} alt={profile.name} />
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
            rows={3}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleSubmit}>
          <h2>Save Changes</h2>
        </button>
      </form>
    </div>
  )
}

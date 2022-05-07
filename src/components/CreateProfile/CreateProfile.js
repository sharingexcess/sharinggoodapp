import { useState } from 'react'
import { createTimestamp, firestore } from 'helpers'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'

const initialValues = {
  name: '',
  school: '',
  bio: '',
}
export function CreateProfile() {
  const [values, setValues] = useState(initialValues)
  const { user } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = {
        ...values,
        id: user.uid,
        email: user.email,
        photoURL: user.photoURL || '/profile_placeholder.png',
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      const profileRef = doc(collection(firestore, 'profiles'), user.uid)
      await setDoc(profileRef, payload)
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

  return (
    <div id="profile-creation" className="page">
      <h2>Create Profile</h2>
      <h3>{user.email}</h3>
      <img src={user.photoURL} alt={user.displayName} />
      <form id="profile-form">
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
        <button onClick={handleSubmit}>
          <h2>Save Changes</h2>
        </button>
      </form>
    </div>
  )
}

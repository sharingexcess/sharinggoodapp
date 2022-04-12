import { useState } from 'react'
import { createTimestamp, firestore } from 'helpers'
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import { useAuth } from 'hooks'

const initialValues = {
  name: '',
  school: '',
  bio: '',
}

export function EditProfile() {
  const [values, setValues] = useState(initialValues)
  const { user } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = {
        ...values,
        id: user.uid,
        email: user.email,
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      const profileRef = doc(collection(firestore, 'profiles'), user.uid)
      await setDoc(profileRef, payload)
    } catch (error) {
      console.log('Error writing new profile to Firestore Database', error)
    }
    console.log(user)
    console.log(values)
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  return (
    <div className="profile-creation">
      <h2>Profile Creation</h2>
      <form id="profile-form">
        <label>Name: </label>
        <input
          type="text"
          name="name"
          id="name"
          value={values.name}
          label="name"
          onChange={handleInputChange}
        />
        <br />
        <label>School: </label>
        <input
          type="text"
          name="school"
          id="school"
          value={values.school}
          label="school"
          onChange={handleInputChange}
        />
        <br />
        <label>Bio: </label>
        <input
          type="text"
          name="bio"
          id="bio"
          value={values.bio}
          label="bio"
          onChange={handleInputChange}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

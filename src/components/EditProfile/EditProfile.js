import { useState } from 'react'
import { createTimestamp } from 'helpers'
import { addDoc, collection, getFirestore, setDoc } from 'firebase/firestore'
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
        id: user.id,
        email: user.email,
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      await addDoc(collection(getFirestore(), 'profiles'), payload)
    } catch (error) {
      console.log('Error writing new profile to Firestore Database', error)
    }
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

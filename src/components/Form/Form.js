import React, { useState } from 'react'
import { createTimestamp } from 'helpers'
import { nanoid } from 'nanoid'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from 'hooks'

const initialValues = {
  id: '',
  owner_id: '',
  title: '',
  description: '',
  status: 'open',
}

// FIX: backspace, timestamp for creation and udpates

export function Form() {
  const [values, setValues] = useState(initialValues)
  const [inputTag, setInputTag] = useState('')
  const [inputTags, setInputTags] = useState([])
  const [isKeyReleased, setIsKeyReleased] = useState(false)
  const { user } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const id = nanoid()
      const payload = {
        ...values,
        id,
        owner_id: user.id,
        timestamp_created: createTimestamp(),
        timestamp_updated: createTimestamp(),
      }
      await addDoc(collection(getFirestore(), 'requests'), payload)
      setValues(initialValues)
      setInputTags([])
    } catch (error) {
      console.log('Error writing new request to Firestore Database', error)
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

  function onChange(event) {
    const { value } = event.target
    setInputTag(value)
  }

  function onKeyDown(event) {
    const { key } = event
    const trimmedTag = inputTag.trim()
    if (
      (key === ',' || key === 'Enter') &&
      trimmedTag.length &&
      !inputTags.includes(trimmedTag)
    ) {
      event.preventDefault()
      setInputTags(prevState => [...prevState, trimmedTag])
      setValues({
        ...values,
        tags: [...inputTags, trimmedTag],
      })
      setInputTag('')
    }
    if (
      key === 'Backspace' &&
      !inputTag.length &&
      inputTags.length &&
      isKeyReleased
    ) {
      const tagsCopy = [...inputTags]
      const poppedTag = tagsCopy.pop()
      event.preventDefault()
      setInputTags(tagsCopy)
      setInputTag(poppedTag)
      setValues({
        ...values,
        tags: inputTags,
      })
    }
    setIsKeyReleased(false)
  }

  function onKeyUp() {
    setIsKeyReleased(true)
  }

  function deleteTag(index) {
    setInputTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  // run setfirestoredata
  return (
    <div className="request-creation">
      <h2>Request Creation</h2>

      <form id="request-form">
        <label>Title: </label>
        <input
          type="text"
          name="title"
          id="title"
          value={values.title}
          label="title"
          onChange={handleInputChange}
        />
        <br />
        <label>Description: </label>
        <input
          type="text"
          name="description"
          id="description"
          value={values.description}
          label="description"
          onChange={handleInputChange}
        />
        <br />

        <div className="tags-container">
          {inputTags.map((tag, index) => (
            <div key={index} className="tag">
              {tag}
              <button onClick={() => deleteTag(index)}>x</button>
            </div>
          ))}
          <label>Tags: </label>
          <input
            type="text"
            name="tags"
            id="tags"
            // value={values.tags}
            value={inputTag}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            label="tags"
            onChange={onChange}
          />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

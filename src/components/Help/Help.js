import { useForm } from '@formspree/react'
import { ExternalLink, Spacer, Text } from '@sharingexcess/designsystem'
import { Page } from 'components'
import { FORMSPREE_FORM_ID } from 'helpers'
import { useAuth } from 'hooks'
import { useEffect, useState } from 'react'

export function Help() {
  const { profile } = useAuth()
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID)
  const [formData, setFormData] = useState({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    message: '',
  })

  useEffect(() => {
    if (state.succeeded) {
      setFormData({
        name: profile?.name,
        email: profile?.email,
        phone: profile?.phone,
        message: '',
      })
    }
  }, [state.succeeded, profile])

  function handleChange(e) {
    setFormData(data => ({ ...data, [e.target.id]: e.target.value }))
  }

  function validateText(text) {
    if (typeof text === 'string') {
      return text.length ? 'valid' : 'invalid'
    } else return undefined
  }

  function isFormComplete() {
    return formData.name && formData.email && formData.message
  }

  return (
    <Page id="Help">
      <Text type="section-header">Reach out for help!</Text>
      <Spacer height={8} />
      <Text type="paragraph">
        Need some assistance? Use the form below to submit any questions or
        feedback to improve the app. You can always feel free to shoot us an
        email at{' '}
        <ExternalLink to="mailto:tech@sharingexcess.com">
          tech@sharingexcess.com
        </ExternalLink>
      </Text>
      <Spacer height={24} />
      <form onSubmit={handleSubmit}>
        <input
          type={profile ? 'hidden' : 'text'}
          value={profile?.name}
          name="name"
          id="name"
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type={profile ? 'hidden' : 'email'}
          value={profile?.email}
          name="email"
          id="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type={profile ? 'hidden' : 'tel'}
          value={profile?.phone}
          name="phone"
          id="phone"
          onChange={handleChange}
          placeholder="Phone"
        />
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className={validateText(formData.message)}
          placeholder="What can we improve?"
        />
        <Spacer height={16} />
        <button
          type="submit"
          className="se-button type-primary size-large color-green full-width"
          disabled={state.submitting || !isFormComplete()}
        >
          Submit
        </button>
        <Spacer height={16} />
      </form>
      {state.succeeded && (
        <Text type="small" align="center" color="white">
          Got it! Thank you so much for reaching out - the Sharing Excess team
          will get back to you ASAP.
        </Text>
      )}
    </Page>
  )
}

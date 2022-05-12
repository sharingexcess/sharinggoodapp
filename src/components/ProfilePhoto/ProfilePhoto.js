import React from 'react'
import { DEFAULT_PROFILE_IMG, handleImageFallback } from 'helpers'
import { useNavigate } from 'react-router'

export function ProfilePhoto({ profile = {}, className, id }) {
  const navigate = useNavigate()
  const src = profile.photoURL ? profile.photoURL : DEFAULT_PROFILE_IMG

  className = className ? 'ProfilePhoto ' + className : 'ProfilePhoto'

  return (
    <img
      src={src}
      style={{ cursor: 'pointer' }}
      className={className}
      id={id}
      alt=""
      onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
      onClick={() => navigate(`/profiles/${profile.id}`)}
    />
  )
}

import React from 'react'
import { DEFAULT_PROFILE_IMG, handleImageFallback } from 'helpers'

export function ProfilePhoto({ profile = {}, className, id }) {
  const src = profile.photoURL ? profile.photoURL : DEFAULT_PROFILE_IMG

  return (
    <img
      src={src}
      className={className}
      id={id}
      alt=""
      onError={e => handleImageFallback(e, DEFAULT_PROFILE_IMG)}
    />
  )
}

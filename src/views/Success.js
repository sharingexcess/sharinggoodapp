import React from 'react'

const Success = () => {
  const email = window.localStorage.getItem('email');

  return (
    <div>Link sent to {email}</div>
  )
}

export default Success
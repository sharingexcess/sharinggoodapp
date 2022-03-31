import React, { useEffect } from 'react';
import { catchLoginLink } from '../helpers/functions';

const LoginUrl = () => {
  useEffect(() => {
    // calls function that catches login
    catchLoginLink(window.location.href);
  }, [])
  
  return (
    <div>Loading...</div>
  )
}

export default LoginUrl
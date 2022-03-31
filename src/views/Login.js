import React from 'react';
import { sendLoginLink } from 'helpers';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    sendLoginLink(email);
    window.localStorage.setItem('email', email);
    navigate("/success");
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:
          <input type="email" name="email" id="email" />
          <button type="submit">Login</button>
        </label>
      </form>
    </div>
  )
}

export default Login
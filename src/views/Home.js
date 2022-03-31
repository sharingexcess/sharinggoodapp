import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../helpers/functions';
import { Header } from '../components/Header/Header';

const Home = () => {
  const {user, setUser} = useAuth();
  
  // FIX: make 2 components
  return (
    <div>
      {user && <Header />}
      Welcome, {user ? user.displayName : "please sign in"}
      <button 
        onClick={
          user 
            ? () => logOut()
            : () => (window.location.href = "/login")
        }>
          {user ? "Logout" : "Login"}
      </button>
    </div>
  )
}

export default Home
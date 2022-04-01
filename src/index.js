import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Login, LoginRedirect, Header, Error } from 'components'
import { Auth } from './providers'
import './styles/index.css'

ReactDOM.render(
  <Auth>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-redirect" element={<LoginRedirect />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </Auth>,
  document.getElementById('root')
)

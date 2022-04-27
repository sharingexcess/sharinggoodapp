import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Header, EditProfile, Requests, Request } from 'components'
import { Auth, Firestore } from './providers'
import './styles/index.scss'

ReactDOM.render(
  <BrowserRouter>
    <Auth>
      <Firestore>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:request_id" element={<Request />} />
        </Routes>
      </Firestore>
    </Auth>
  </BrowserRouter>,
  document.getElementById('root')
)

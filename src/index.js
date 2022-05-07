import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Header,
  EditProfile,
  Requests,
  Request,
  Chat,
  Form,
  Help,
  Login,
  Home,
} from 'components'
import { Auth, Firestore } from './providers'
import { EmojiProvider } from 'react-apple-emojis'
import emojiData from './styles/emojis.json'
import './styles/index.scss'

ReactDOM.render(
  <BrowserRouter>
    <EmojiProvider data={emojiData}>
      <Auth>
        <Firestore>
          <Header />
          <Routes>
            <Route path="/" element={<Requests />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/create-request" element={<Form />} />
            <Route path="/requests/:request_id" element={<Request />} />
            <Route path="/requests/:request_id/chat" element={<Chat />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Firestore>
      </Auth>
    </EmojiProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

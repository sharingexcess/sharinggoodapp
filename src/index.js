import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Header,
  EditProfile,
  Requests,
  Request,
  Conversation,
  Form,
  Help,
  Login,
  Home,
  Error,
  SignUp,
  ProtectedRoute,
  Profiles,
  Profile,
  Conversations,
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:request_id" element={<Request />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute permission_level={1}>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-request"
              element={
                <ProtectedRoute permission_level={3}>
                  <Form />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:conversation_id"
              element={
                <ProtectedRoute permission_level={1}>
                  <Conversation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute permission_level={1}>
                  <Conversations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles"
              element={
                <ProtectedRoute permission_level={1}>
                  <Profiles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/:id"
              element={
                <ProtectedRoute permission_level={1}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/help" element={<Help />} />
            <Route path="/error" element={<Error />} />
            <Route
              path="*"
              element={<Error message="This page does not exist!" />}
            />
          </Routes>
        </Firestore>
      </Auth>
    </EmojiProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

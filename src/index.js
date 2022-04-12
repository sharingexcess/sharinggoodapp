import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Header } from 'components'
import { Auth, Firestore } from './providers'
import './styles/index.scss'

ReactDOM.render(
  <BrowserRouter>
    <Auth>
      <Firestore>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Firestore>
    </Auth>
  </BrowserRouter>,
  document.getElementById('root')
)

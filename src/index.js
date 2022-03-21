import { Header } from 'components'
import { Auth } from 'providers'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'

function SharingGoodApp() {
  return (
    <Auth>
      <Header />
    </Auth>
  )
}

ReactDOM.render(<SharingGoodApp />, document.getElementById('root'))

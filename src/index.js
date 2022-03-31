import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth } from './providers'
import './styles/index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth>
        <App />
      </Auth>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// import { Header } from 'components'
// import { Auth } from 'providers'
// import React from 'react'
// import ReactDOM from 'react-dom'


// function SharingGoodApp() {
//   return (
//     <Auth>
//       <Header />
//     </Auth>
//   )
// }

// ReactDOM.render(<SharingGoodApp />, document.getElementById('root'))

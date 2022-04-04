import { useNavigate } from 'react-router'

export function Error({ message }) {
  const navigate = useNavigate()
  return (
    <div id="Error" className="page">
      <h1 role="img">🚨</h1>
      <h2>Whoops!</h2>
      <p>Looks like this page isn't working, or doesn't exist.</p>
      <button onClick={() => navigate('/')}>return home</button>
      {message && <aside>Error Message: {message}</aside>}
    </div>
  )
}

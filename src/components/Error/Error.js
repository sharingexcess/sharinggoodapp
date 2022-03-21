import { Ellipsis } from 'components'

export function Error({ message }) {
  return (
    <div id="Error" className="page">
      <h1 role="img">🚨</h1>
      <h2>Whoops!</h2>
      <p>Looks like this page isn't working, or doesn't exist.</p>
      {message && <aside>Error Message: {message}</aside>}
    </div>
  )
}

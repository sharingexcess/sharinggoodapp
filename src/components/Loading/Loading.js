import { Ellipsis } from 'components'

export function Loading({ text }) {
  return (
    <div id="Loading" className="page">
      <h1 role="img">⚙️</h1>
      <h2>
        {text || 'Loading'}
        <Ellipsis />
      </h2>
    </div>
  )
}

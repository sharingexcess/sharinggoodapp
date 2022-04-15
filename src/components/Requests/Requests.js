import React from 'react'
import { Request } from 'components/Request/Request'
import { useFirestore } from 'hooks/useFirestore'

export function Requests() {
  const requests = useFirestore('requests')
  return (
    <div id="requests-container">
      <h3>Open Requests</h3>
      {requests &&
        requests.map(request => <Request key={request.id} data={request} />)}
    </div>
  )
}

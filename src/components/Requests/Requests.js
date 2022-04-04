import React from 'react'
import { Request } from 'components/Request/Request'
import { useFirestore } from 'hooks/useFirestore'

export function Requests() {
  const requests = useFirestore('requests')
  return (
    <div>
      {requests &&
        requests.map(request => <Request key={request.id} data={request} />)}
    </div>
  )
}

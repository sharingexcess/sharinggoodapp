import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'

export function Home() {
  const { user } = useAuth()

  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {user.name} </h2>
      <Requests />
      <Form />
    </div>
  )
}

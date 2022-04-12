import { useAuth } from 'hooks'
import { Form } from 'components/Form/Form'
import { Requests } from 'components/Requests/Requests'

export function Home() {
  const { profile } = useAuth()

  return (
    <div id="Home" className="page">
      <h2>Sucessfully logged in {profile.name} </h2>
      <Requests />
      <Form />
    </div>
  )
}

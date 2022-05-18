import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loading, ProfilePhoto, Page } from 'components'
import { useAuth, useFirestore } from 'hooks'
import {
  Button,
  Card,
  FlexContainer,
  Spacer,
  Text,
} from '@sharingexcess/designsystem'
import { getPermissionLevel } from 'helpers'

export function Profiles() {
  const { profile } = useAuth()
  const profiles = useFirestore('profiles')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(3)

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  function filterBySearch(array) {
    return array.filter(
      i => i.id && i.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  function filterByFilter(array) {
    return array.filter(i => i.id && (!filter || i.permission_level === filter))
  }

  return !profiles.length ? (
    <Loading text="Loading profiles" />
  ) : (
    <Page id="Profiles">
      <Text type="secondary-header" color="black">
        Profiles
      </Text>
      <Spacer height={4} />
      <Text type="small" color="grey">
        Get to know the community of Sharing Good!
      </Text>
      <Spacer height={24} />
      <FlexContainer primaryAlign="start" id="Requests-filters">
        <Button
          size="small"
          color="green"
          type={filter === null ? 'primary' : 'secondary'}
          handler={() => setFilter(null)}
        >
          All
        </Button>
        <Spacer width={4} />
        <Button
          size="small"
          color="green"
          type={filter === 3 ? 'primary' : 'secondary'}
          handler={() => setFilter(3)}
        >
          Teachers
        </Button>
        <Spacer width={4} />
        <Button
          size="small"
          color="green"
          type={filter === 1 ? 'primary' : 'secondary'}
          handler={() => setFilter(1)}
        >
          Donors
        </Button>
        <Spacer width={4} />
        <Button
          size="small"
          color="green"
          type={filter === 5 ? 'primary' : 'secondary'}
          handler={() => setFilter(5)}
        >
          Admins
        </Button>
      </FlexContainer>
      <Spacer height={16} />
      <label htmlFor="email">SEARCH</label>
      <input type="text" value={search} onChange={handleSearch} />

      <Spacer height={16} />

      {filterBySearch(filterByFilter(profiles)).map(i => (
        <Link key={i.id} className="wrapper" to={`/profiles/${i.id}`}>
          <Card classList={['Profile']}>
            <ProfilePhoto profile={i} className="Profile-icon" />
            <div>
              <Text type="section-header" color="black">
                {i.name}
              </Text>
              <Text type="small" color="grey">
                {i.location || 'no listed location'} -{' '}
                {i.school || 'no listed school'}
              </Text>

              {profile.permission_level > 3 && (
                <Text type="small" color="blue">
                  {i.email}
                </Text>
              )}
              {i.permission_level > 1 && (
                <Text type="small" color="grey">
                  {getPermissionLevel(i.permission_level)}
                </Text>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </Page>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loading, ProfilePhoto, Page } from 'components'
import { useAuth, useFirestore } from 'hooks'
import { Card, Spacer, Text } from '@sharingexcess/designsystem'
import { getPermissionLevel } from 'helpers'

export function Profiles() {
  const { profile } = useAuth()
  const profiles = useFirestore('profiles')
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  function filterBySearch(array) {
    return array.filter(
      i => i.id && i.name.toLowerCase().includes(search.toLowerCase())
    )
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
      <label htmlFor="email">SEARCH</label>
      <input type="text" value={search} onChange={handleSearch} />

      <Spacer height={16} />

      {filterBySearch(profiles).map(i => (
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

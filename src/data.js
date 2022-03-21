export const test_requests = [
  {
    id: 'test_request_ryan',
    title: "Ryan's Request",
    description: 'This is a test request, thank you!',
    owner_id: 'ryan',
    donor_id: 'evan',
    status: 'active',
  },
  {
    id: 'test_request_evan',
    title: "Evan' Request",
    description: 'This is a test request, thank you!',
    owner_id: 'evan',
    donor_id: null,
    status: 'active',
  },
]

export const test_users = [
  {
    id: 'ryan',
    name: 'Ryan McHenry',
    email: 'ryan@sharingexcess.com',
    image: '/ryan.png',
  },
  {
    id: 'evan',
    name: 'Evan Ehlers',
    email: 'evan@sharingexcess.com',
    image: '/evan.png',
  },
]

export const test_messages = [
  {
    request_id: 'test_request_ryan',
    sender_id: 'ryan',
    timestamp: new Date('2022-02-01').toString(),
    message: 'Hey! This is a test message.',
  },
  {
    request_id: 'test_request_ryan',
    sender_id: 'evan',
    timestamp: new Date('2022-02-02').toString(),
    message: 'Very cool!',
  },
]

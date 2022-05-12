export const DEFAULT_PROFILE_IMG = '/profile_placeholder.png'

export const COLLECTIONS = {
  REQUESTS: 'requests',
  PROFILES: 'profiles',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
}

export const STATUSES = {
  OPEN: 'open',
  PENDING: 'pending',
  COMPLETED: 'completed',
}

export const MOBILE_THRESHOLD = 600

export const PERMISSION_LEVELS = {
  NONE: 0,
  BASIC: 1,
  CREATOR: 3,
  ADMIN: 5,
  MODERATOR: 9,
}

export const FORMSPREE_FORM_ID = process.env.REACT_APP_FORMSPREE_FORM_ID

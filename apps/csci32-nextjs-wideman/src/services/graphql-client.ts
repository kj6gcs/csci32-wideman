import { GraphQLClient } from 'graphql-request'

const isBrowser = typeof window !== 'undefined'

// Server (SSR/RSC) uses explicit base; Browser uses window.location.origin (absolute)
const serverBase = process.env.NEXT_SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'

const endpoint = isBrowser
  ? `${window.location.origin.replace(/\/+$/, '')}/graphql` // absolute URL for browser
  : `${serverBase.replace(/\/+$/, '')}/graphql` // server-side base

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('[gql endpoint]', endpoint)
}

export const gqlClient = new GraphQLClient(endpoint)

export function setAuthToken(token: string) {
  gqlClient.setHeader('Authorization', `Bearer ${token}`)
  if (isBrowser) localStorage.setItem('authToken', token)
}
export function clearAuthToken() {
  gqlClient.setHeader('Authorization', '')
  if (isBrowser) localStorage.removeItem('authToken')
}
export function initializeAuth() {
  if (isBrowser) {
    const t = localStorage.getItem('authToken')
    if (t) gqlClient.setHeader('Authorization', `Bearer ${t}`)
  }
}
initializeAuth()

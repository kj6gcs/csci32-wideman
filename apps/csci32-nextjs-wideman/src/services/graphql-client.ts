import { GraphQLClient } from 'graphql-request'

const GRAPHQL_API_URL = '/api/graphql'

// Create singleton GraphQL client
export const gqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}${GRAPHQL_API_URL}`)

// Auth helper functions
export function setAuthToken(token: string) {
  gqlClient.setHeader('Authorization', `Bearer ${token}`)
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

export function clearAuthToken() {
  gqlClient.setHeader('Authorization', '')
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

export function initializeAuth() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      gqlClient.setHeader('Authorization', `Bearer ${token}`)
    }
  }
}

// Initialize auth on module load
initializeAuth()

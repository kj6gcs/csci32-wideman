import { GraphQLClient } from 'graphql-request'

const GRAPHQL_API_URL = '/graphql'

// This is the singleton GraphQL client:
export const gqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}${GRAPHQL_API_URL}`)

// Auth helper functions are here:
export function setAuthToken(token: string) {
  gqlClient.setHeader('Authorization', `Bearer ${token}`)
  // Stores it in localStorage for persistence
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

export function intializeAuth() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      gqlClient.setHeader('Authorization', `Bearer ${token}`)
    }
  }
}

// Initialize auth on module loading
intializeAuth()

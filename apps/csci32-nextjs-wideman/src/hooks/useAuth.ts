'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gqlClient, setAuthToken, clearAuthToken } from '../services/graphql-client'
import { graphql } from '../generated/gql'
import type { SignUpInput, SignInInput, AuthPayload, UserDto } from '../generated/graphql'
import { ClientError, RequestDocument } from 'graphql-request'

const SIGN_UP_MUTATION = graphql(`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        user_id
        name
        email
      }
    }
  }
`) as unknown as RequestDocument

const SIGN_IN_MUTATION = graphql(`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        user_id
        name
        email
      }
    }
  }
`) as unknown as RequestDocument

async function requestWithRetry<T>(doc: RequestDocument, vars?: Record<string, unknown>, tries = 2): Promise<T> {
  for (let i = 0; i < tries; i++) {
    try {
      return await gqlClient.request<T>(doc, vars)
    } catch (e) {
      if (i === tries - 1) throw e
      await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw new Error('unreachable')
}

// Error extraction with more details
function extractErrorMessage(err: unknown, fallback: string): string {
  // full details in dev console
  // eslint-disable-next-line no-console
  console.error('Auth error:', err)

  if (err instanceof ClientError) {
    const gqlMsg = err.response?.errors?.[0]?.message
    if (gqlMsg) return gqlMsg

    const status = err.response?.status
    const statusText = err.response?.statusText
    const requestObj = (err as ClientError).request as unknown
    let url: string | undefined
    if (requestObj && typeof requestObj === 'object' && 'url' in requestObj) {
      const maybeUrl = (requestObj as { url?: unknown }).url
      if (typeof maybeUrl === 'string') url = maybeUrl
    }
    const bodyPreview =
      typeof err.response?.data === 'string'
        ? err.response.data.slice(0, 200)
        : JSON.stringify(err.response?.data ?? {}).slice(0, 200)

    return `Request failed ${status ?? ''} ${statusText ?? ''} at ${url ?? ''} — ${bodyPreview || fallback}`.trim()
  }

  if (err && typeof err === 'object' && 'message' in err) {
    const maybeMessage = (err as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.length) {
      return maybeMessage
    }
    return fallback
  }

  return fallback
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserDto | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null
      if (storedUser) setUser(JSON.parse(storedUser))
    } catch {
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const signUp = async (input: SignUpInput): Promise<AuthPayload | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await requestWithRetry<{ signUp: AuthPayload | null }>(SIGN_UP_MUTATION, { input })

      if (result?.signUp) {
        setAuthToken(result.signUp.token)
        setUser(result.signUp.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(result.signUp.user))
        }
        router.push('/dashboard')
        return result.signUp
      }

      return null
    } catch (err) {
      setError(extractErrorMessage(err, 'Sign up failed'))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (input: SignInInput): Promise<AuthPayload | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await requestWithRetry<{ signIn: AuthPayload | null }>(SIGN_IN_MUTATION, { input })

      if (result?.signIn) {
        setAuthToken(result.signIn.token)
        setUser(result.signIn.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(result.signIn.user))
        }
        router.push('/dashboard')
        return result.signIn
      }

      return null
    } catch (err) {
      setError(extractErrorMessage(err, 'Sign in failed'))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    clearAuthToken()
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser')
    }
    setError(null)
  }

  const clearError = () => setError(null)

  return {
    isLoading,
    error,
    user,
    isHydrated,
    signUp,
    signIn,
    signOut,
    clearError,
  }
}

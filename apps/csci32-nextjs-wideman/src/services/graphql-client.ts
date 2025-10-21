import { GraphQLClient, RequestDocument } from 'graphql-request'
import type { DocumentNode, DefinitionNode, OperationDefinitionNode } from 'graphql'
import { createClient as createSupabase } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  (SUPABASE_URL ? `${SUPABASE_URL.replace(/\/+$/, '')}/graphql/v1` : '/api/graphql')

export const gqlClient = new GraphQLClient(endpoint)

// For Supabase GraphQL table access, send anon key by default
if (SUPABASE_ANON_KEY) {
  gqlClient.setHeader('apikey', SUPABASE_ANON_KEY)
  gqlClient.setHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`)
}

// ---- Token management used by your hook ----
let runtimeAuthToken: string | null = null
export function setAuthToken(token: string) {
  runtimeAuthToken = token
  if (SUPABASE_ANON_KEY) gqlClient.setHeader('apikey', SUPABASE_ANON_KEY)
  gqlClient.setHeader('Authorization', `Bearer ${token}`)
}
export function clearAuthToken() {
  runtimeAuthToken = null
  const headers: Record<string, string> = {}
  if (SUPABASE_ANON_KEY) {
    headers['apikey'] = SUPABASE_ANON_KEY
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`
  }
  gqlClient.setHeaders(headers)
}

// ---- Supabase Auth shim for SignUp / SignIn (no `any`) ----
const supabase = createSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)

function getOperationName(doc: RequestDocument): string | null {
  if (typeof doc === 'string') {
    const m = doc.match(/\bmutation\s+(\w+)/) || doc.match(/\bquery\s+(\w+)/)
    return m?.[1] ?? null
  }
  // Read from AST definitions (loc is often stripped in prod)
  const maybeDoc = doc as Partial<DocumentNode>
  const defs = Array.isArray(maybeDoc.definitions) ? (maybeDoc.definitions as DefinitionNode[]) : []
  for (const def of defs) {
    if (def.kind === 'OperationDefinition') {
      const od = def as OperationDefinitionNode
      if (od.name?.value) return od.name.value
    }
  }
  return null
}

type Vars = Record<string, unknown>
function isSignUpVars(v: unknown): v is { input: { email: string; password: string; name?: string } } {
  if (!v || typeof v !== 'object') return false
  const input = (v as Record<string, unknown>).input
  if (!input || typeof input !== 'object') return false
  const i = input as Record<string, unknown>
  return typeof i.email === 'string' && typeof i.password === 'string'
}
function isSignInVars(v: unknown): v is { input: { email: string; password: string } } {
  if (!v || typeof v !== 'object') return false
  const input = (v as Record<string, unknown>).input
  if (!input || typeof input !== 'object') return false
  const i = input as Record<string, unknown>
  return typeof i.email === 'string' && typeof i.password === 'string'
}

const rawRequest = gqlClient.request.bind(gqlClient)

async function requestShim<T>(doc: RequestDocument, vars?: Vars): Promise<T> {
  const name = getOperationName(doc)

  if (name === 'SignUp' && isSignUpVars(vars)) {
    const { email, password, name: displayName } = vars.input
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: displayName ? { data: { name: displayName } } : undefined,
    })
    if (error) throw error
    const token = data.session?.access_token ?? ''
    const u = data.user
    if (!u || !token) {
      throw new Error('Check your email to confirm your account before signing in.')
    }
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>
    const safeName = typeof meta.name === 'string' ? meta.name : null
    setAuthToken(token)
    return {
      signUp: {
        token,
        user: { user_id: u.id, name: safeName, email: u.email },
      },
    } as unknown as T
  }

  if (name === 'SignIn' && isSignInVars(vars)) {
    const { email, password } = vars.input
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const token = data.session?.access_token ?? ''
    const u = data.user
    if (!u || !token) throw new Error('Invalid credentials')
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>
    const safeName = typeof meta.name === 'string' ? meta.name : null
    setAuthToken(token)
    return {
      signIn: {
        token,
        user: { user_id: u.id, name: safeName, email: u.email },
      },
    } as unknown as T
  }

  return rawRequest<T>(doc, vars)
}

// Monkey-patch the client method, preserving its type
;(gqlClient as unknown as { request: typeof requestShim }).request = requestShim

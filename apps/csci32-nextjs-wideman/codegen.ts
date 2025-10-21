import type { CodegenConfig } from '@graphql-codegen/cli'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// Still trying to get it to run in Vercel....
const schemaUrl = isCI ? process.env.SCHEMA_URL : (process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/graphql')

if (isCI && !schemaUrl) {
  console.error('[codegen] SCHEMA_URL is not set in CI. Set SCHEMA_URL to your public GraphQL endpoint.')
  process.exit(1)
}

const token = process.env.SCHEMA_TOKEN
if (isCI && !token) {
  console.warn('[codegen] SCHEMA_TOKEN is missing — Supabase will reject without apikey')
}
const headers = token ? { apikey: token, Authorization: `Bearer ${token}` } : {}

// Showing where we’re fetching the schema from
console.log(`[codegen] Using schema: ${schemaUrl}`)

const useRemoteWithHeaders = !!(schemaUrl && token)
const schemaSource = useRemoteWithHeaders
  ? [{ [schemaUrl!]: { headers } }]
  : // Fallbacks:
    schemaUrl
    ? schemaUrl
    : 'schema.graphql'

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config

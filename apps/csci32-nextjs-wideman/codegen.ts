// apps/csci32-nextjs-wideman/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// 1) CI uses the checked-in snapshot (so auth mutations exist)
const localSnapshot = path.resolve(__dirname, 'schema.local.graphql')

// 2) Local/dev can hit your remote (Supabase) or your local server
const schemaUrl = process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/graphql'
const token = process.env.SCHEMA_TOKEN

// Make headers either a real map or undefined (not a {} union)
const supabaseHeaders: Record<string, string> | undefined = token
  ? { apikey: token, Authorization: `Bearer ${token}` }
  : undefined

// --- Typed HTTP schema pointer ---
type HttpSchemaPointer = { [url: string]: { headers?: Record<string, string> } }
const remoteWithHeaders: HttpSchemaPointer[] = [{ [schemaUrl]: { headers: supabaseHeaders } }]

// Build the schema source (cast to satisfy Codegen’s schema type)
const schemaSource: CodegenConfig['schema'] = isCI
  ? localSnapshot
  : (remoteWithHeaders as unknown as CodegenConfig['schema'])

// Helpful logging that reflects the actual source
console.log(`[codegen] Using ${isCI ? 'snapshot' : 'remote'} schema: ${isCI ? localSnapshot : schemaUrl}`)

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

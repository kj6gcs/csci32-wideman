import type { CodegenConfig } from '@graphql-codegen/cli'
import fs from 'node:fs'
import path from 'node:path'

const appDir = __dirname
const snapshotPath = path.join(appDir, 'schema.local.graphql')

// prefer file if present
const hasSnapshot = fs.existsSync(snapshotPath)

// allow explicit override via env (file path OR URL)
const envPointer = process.env.SCHEMA_POINTER

// final fallback: a URL only if you really want one
const fallbackUrl =
  process.env.CODEGEN_SCHEMA_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://127.0.0.1:4000/api/graphql' // note /api/graphql if that’s your route

const schemaPointer = envPointer || (hasSnapshot ? snapshotPath : fallbackUrl)

// optional bearer for URL schemas
const bearer = process.env.CODEGEN_BEARER

// tiny, honest log so you can see what it chose
// (remove if you don’t want logs)
// eslint-disable-next-line no-console
console.log('[codegen] Using schema pointer:', schemaPointer)

const config: CodegenConfig = {
  schema: [bearer ? { [schemaPointer]: { headers: { Authorization: `Bearer ${bearer}` } } } : schemaPointer],
  documents: ['src/**/*.{ts,tsx,gql,graphql}'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
  silent: false,
}

export default config

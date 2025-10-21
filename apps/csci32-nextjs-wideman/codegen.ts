// apps/csci32-nextjs-wideman/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// In CI: require SCHEMA_URL. Locally: default to your running backend.
const schemaUrl = isCI ? process.env.SCHEMA_URL : (process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/graphql')

if (isCI && !schemaUrl) {
  // Fail with a clear message (prevents silent fallback to localhost in CI)
  // eslint-disable-next-line no-console
  console.error(
    '[codegen] SCHEMA_URL is not set in CI. ' +
      'Set SCHEMA_URL to your public GraphQL endpoint (e.g. https://api.example.com/graphql).',
  )
  process.exit(1)
}

// Optional: show where we’re fetching the schema from
// eslint-disable-next-line no-console
console.log(`[codegen] Using schema: ${schemaUrl}`)

const config: CodegenConfig = {
  schema: schemaUrl!,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] }, // still gitignored
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

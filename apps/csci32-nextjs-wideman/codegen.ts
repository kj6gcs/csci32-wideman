import type { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.SCHEMA_URL || 'http://127.0.0.1:4000/graphql'

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ['src/**/*.{ts,tsx}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: true, // This prevents errors if no documents are found
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config

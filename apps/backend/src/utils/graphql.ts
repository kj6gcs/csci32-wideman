// apps/backend/src/utils/graphql.ts
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import type { NonEmptyArray } from 'type-graphql'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { UserResolver } from '@/resolvers/UserResolver'
import type { UserService } from '@/services/UserService'
import { PrismaClient } from 'csci32-database'

import mercurius from 'mercurius'
import mercuriusLogging from 'mercurius-logging'

const GRAPHQL_API_PATH = '/graphql'
const UI_PATH = '/graphiql'
const GRAPHQL_DEPTH_LIMIT = 7

const resolvers = [UserResolver] as NonEmptyArray<Function>

export interface Context {
  request: FastifyRequest
  reply: FastifyReply
  userService: UserService
  prisma: PrismaClient
}

export async function registerGraphQL(fastify: FastifyInstance) {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  })

  await fastify.register(mercurius, {
    schema,
    path: GRAPHQL_API_PATH,
    cache: false,
    graphiql: false, // we serve our own UI route below
    ide: false,
    queryDepth: GRAPHQL_DEPTH_LIMIT,
    allowBatchedQueries: false,
    // allowIntrospection: true, // ensure the UI can introspect the schema
    context: (request: FastifyRequest, reply: FastifyReply): Context => ({
      request,
      reply,
      userService: fastify.userService,
      prisma: fastify.prisma,
    }),
  })

  // Lightweight, pinned GraphiQL HTML (no extra deps)
  const graphiqlHTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>GraphiQL</title>
    <link rel="stylesheet" href="https://unpkg.com/graphiql@2.4.0/graphiql.min.css"/>
    <style>html,body,#graphiql{height:100%;margin:0}</style>
  </head>
  <body>
    <div id="graphiql">Loading…</div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/graphiql@2.4.0/graphiql.min.js"></script>
    <script>
      const fetcher = GraphiQL.createFetcher({ url: '${GRAPHQL_API_PATH}' });
      const el = React.createElement(GraphiQL, {
        fetcher,
        headerEditorEnabled: true,
        defaultEditorToolsVisibility: true,
        query: '{ __typename }'
      });
      ReactDOM.render(el, document.getElementById('graphiql'));
    </script>
  </body>
</html>`

  fastify.get(UI_PATH, async (_req, reply) => {
    reply.type('text/html').send(graphiqlHTML)
  })

  await fastify.register(mercuriusLogging, {
    prependAlias: true,
    logBody: true,
    logVariables: (process.env.NODE_ENV ?? 'development') === 'development',
  })
}

import { UserResolver } from '@/resolvers/UserResolver'
import { PostResolver } from '@/resolvers/types/PostResolver'
import { buildSchema, registerEnumType } from 'type-graphql'
import { customAuthChecker } from '@/utils/authChecker'
import { PermissionName, RoleName } from 'csci32-database'
import type { NonEmptyArray } from 'type-graphql'
import type { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from 'csci32-database'
import { getBooleanEnvVar, getRequiredStringEnvVar } from '@/utils'
import type { UserService } from '@/services/UserService'
import type { PostService } from '@/services/PostService'
import mercurius from 'mercurius'
import mercuriusLogging from 'mercurius-logging'
import { RoleResolver } from '@/resolvers/RoleResolver'

const GRAPHQL_API_PATH = '/api/graphql'
const GRAPHQL_DEPTH_LIMIT = 7

// 1️⃣ Register the enums with TypeGraphQL
registerEnumType(PermissionName, {
  name: 'PermissionName',
  description: 'Enum representing valid permissions for authorization',
})

registerEnumType(RoleName, {
  name: 'RoleName',
  description: 'Enum representing valid roles for users',
})

const resolvers = [UserResolver, RoleResolver, PostResolver] as NonEmptyArray<Function>

export interface Context {
  request: FastifyRequest
  reply: FastifyReply
  userService: UserService
  postService: PostService
  prisma: PrismaClient
  log: FastifyBaseLogger
}

export async function registerGraphQL(fastify: FastifyInstance) {
  const schema = await buildSchema({
    resolvers,
    authChecker: customAuthChecker,
  })

  const graphiql = getBooleanEnvVar('ENABLE_GRAPHIQL', false)
  fastify.log.info(`GraphiQL is ${graphiql ? 'enabled' : 'disabled'}`)

  const options = {
    schema,
    cache: false,
    path: GRAPHQL_API_PATH,
    graphiql,
    queryDepth: GRAPHQL_DEPTH_LIMIT,
    context: (request: FastifyRequest, reply: FastifyReply): Context => ({
      request,
      reply,
      userService: fastify.userService,
      postService: fastify.postService,
      prisma: fastify.prisma,
      log: fastify.log,
    }),
    allowBatchedQueries: false,
  }

  await fastify.register(mercurius, options)
  await fastify.register(mercuriusLogging, {
    prependAlias: true,
    logBody: true,
    logVariables: getRequiredStringEnvVar('NODE_ENV') === 'development',
  })
}

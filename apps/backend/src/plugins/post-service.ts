import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { PRISMA_FASTIFY_PLUGIN_NAME } from './00-prisma'
import { PostService } from '@/services/PostService'

declare module 'fastify' {
  interface FastifyInstance {
    postService: PostService
  }
}

export const POST_SERVICE_FASTIFY_PLUGIN_NAME = 'postService'

export default fp(
  async function postServicePlugin(fastify: FastifyInstance) {
    const postService = new PostService({ prisma: fastify.prisma })
    fastify.decorate(POST_SERVICE_FASTIFY_PLUGIN_NAME, postService)
  },
  { name: POST_SERVICE_FASTIFY_PLUGIN_NAME, dependencies: [PRISMA_FASTIFY_PLUGIN_NAME] },
)

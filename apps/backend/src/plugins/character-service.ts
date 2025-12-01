import { CharacterService } from '@/services/CharacterService'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { PRISMA_FASTIFY_PLUGIN_NAME } from './00-prisma'

declare module 'fastify' {
  interface FastifyInstance {
    characterService: CharacterService
  }
}

export const CHARACTER_SERVICE_FASTIFY_PLUGIN_NAME = 'characterService'

export default fp(
  async function characterServicePlugin(fastify: FastifyInstance) {
    const characterService = new CharacterService({ prisma: fastify.prisma })
    fastify.decorate(CHARACTER_SERVICE_FASTIFY_PLUGIN_NAME, characterService)
  },
  {
    name: CHARACTER_SERVICE_FASTIFY_PLUGIN_NAME,
    dependencies: [PRISMA_FASTIFY_PLUGIN_NAME],
  },
)

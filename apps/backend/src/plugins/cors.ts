import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { getRequiredStringEnvVar } from '@/utils'

export default fp(async (fastify, opts) => {
  await fastify.register(cors, {
    origin: [getRequiredStringEnvVar('CORS_ORIGIN')],
  })
})

import type { Context } from '@/utils/graphql'
import jwt from 'jsonwebtoken'
import type { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken'
import type { PermissionName } from 'csci32-database'
import { getRequiredStringEnvVar } from '@/utils'

interface JwtPayload extends DefaultJwtPayload {
  sub: string
  email?: string
  role?: string
  permissions?: PermissionName[]
}

export function getDecodedToken(ctx: Context): JwtPayload {
  const authHeader = ctx.request?.headers?.authorization as string | undefined
  if (!authHeader) throw new Error('Unauthorized')

  const token = authHeader.replace('Bearer ', '')

  const decoded = jwt.verify(token, getRequiredStringEnvVar('PUBLIC_KEY'), {
    algorithms: [(process.env.JWT_ALG ?? 'RS256') as jwt.Algorithm],
  })

  return decoded as JwtPayload
}

export function getUserIdFromJwt(ctx: Context): string {
  const decoded = getDecodedToken(ctx)

  if (!decoded.sub) {
    throw new Error('Invalid token: missing subject (sub)')
  }

  return decoded.sub
}

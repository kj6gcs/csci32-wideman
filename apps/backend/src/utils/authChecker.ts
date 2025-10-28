import type { AuthChecker } from 'type-graphql'
import jwt from 'jsonwebtoken'
import type { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken'
import type { Context } from '@/utils/graphql'
import { PermissionName } from 'csci32-database'

interface JwtPayload extends DefaultJwtPayload {
  sub: string
  email: string
  role?: string
  permissions?: PermissionName[]
}

export const customAuthChecker: AuthChecker<Context> = ({ context }, requiredPermissions) => {
  const authHeader = context.request.headers.authorization
  if (!authHeader) {
    return false
  }

  try {
    // Extracts the raw JWT by removing the "Bearer " prefix from the Authorization header.
    // ex. "Bearer <token>" -> "<token>"
    const token = authHeader.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY as string, {
      algorithms: [(process.env.ALGORITHM ?? 'ES256') as jwt.Algorithm],
    })

    // ✅ If no specific permissions are required, any authenticated user passes
    if (!requiredPermissions.length) {
      return true
    }

    // ✅ Narrow the type properly before assuming shape
    const isPayloadObject = typeof decodedToken === 'object'
    const payload = isPayloadObject ? (decodedToken as JwtPayload) : null

    if (!payload) {
      return false
    }

    const userPerms = payload.permissions ?? []

    // ✅ Check that the user has all required permissions
    return requiredPermissions.every((perm) => userPerms.includes(perm as PermissionName))
  } catch (err) {
    return false
  }
}

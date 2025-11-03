import { Resolver, FieldResolver, Root, Query, Ctx } from 'type-graphql'
import { Role } from './types/Role'
import { Permission } from './types/Permission'
import { PrismaClient } from 'csci32-database'
import type { Context } from '@/utils/graphql'

const prisma = new PrismaClient()

@Resolver(() => Role)
export class RoleResolver {
  @FieldResolver(() => [Permission])
  async permissions(@Root() role: Role, @Ctx() ctx: Context) {
    const data = await prisma.role.findUnique({
      where: { role_id: role.role_id },
      include: { role_permissions: { include: { permission: true } } },
    })
    return data?.role_permissions?.map((rp) => rp.permission) ?? []
  }
}

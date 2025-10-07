import type { SignUpInput } from '@/resolvers/types/AuthTypes'
import { hashPassword, signToken } from '@/utils/auth'
import { PrismaClient } from 'csci32-database'

export interface UserServiceProps {
  prisma: PrismaClient
}

export class UserService {
  prisma: PrismaClient

  constructor({ prisma }: UserServiceProps) {
    this.prisma = prisma
  }

  findMany() {
    return this.prisma.user.findMany()
  }

  async createUser(params: SignUpInput) {
    const { email, password, name } = params

    // 1) Enforce unique email
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new Error('Email already in use')
    }

    // 2) Hash password
    const passwordHash = await hashPassword(password)

    // 3) Create user (adjust model/field names to your Prisma schema)
    const created = await this.prisma.user.create({
      data: { email, name: name ?? null, passwordHash },
      select: { user_id: true, email: true, name: true },
    })

    // 4) Sign JWT with standard claims
    const token = signToken({
      sub: created.user_id,
      email: created.email,
      name: created.name ?? undefined,
    })

    return { user: created, token }
  }
}

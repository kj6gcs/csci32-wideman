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
}

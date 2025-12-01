import type { PrismaClient, Prisma } from 'csci32-database'

export interface ServiceDeps {
  prisma: PrismaClient
}

export type CreatePostInput = {
  title: string
  body: string
  comments?: { body: string }[]
}

export type ListPostsOptions = {
  search?: string
  skip?: number
  take?: number
  sortField?: 'createdAt' | 'title'
  sortDirection?: 'asc' | 'desc'
}

export class PostService {
  constructor(private deps: ServiceDeps) {}

  async findOneById(id: string) {
    const { prisma } = this.deps

    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    })
  }

  async findMany(options: ListPostsOptions = {}) {
    const { prisma } = this.deps
    const { search, skip = 0, take = 10, sortField = 'createdAt', sortDirection = 'desc' } = options

    const where: Prisma.PostWhereInput =
      search !== undefined
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { body: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}

    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortField]: sortDirection,
    }

    return prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        author: true,
        comments: true,
      },
    })
  }
}

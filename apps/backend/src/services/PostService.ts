import type { PrismaClient } from 'csci32-database'

export interface ServiceDeps {
  prisma: PrismaClient
}

export type CreatePostData = {
  title: string
  body: string
  comments?: { body: string }[]
}

export class PostService {
  constructor(private deps: ServiceDeps) {}

  async createForAuthor(input: CreatePostData, authorUserId: string) {
    const { prisma } = this.deps
    const { title, body, comments } = input

    if (comments?.length) {
      return prisma.post.create({
        data: {
          title,
          body,
          authorId: authorUserId,
          comments: { create: comments },
        },
        include: { author: true, comments: true },
      })
    }

    return prisma.post.create({
      data: { title, body, authorId: authorUserId },
      include: { author: true },
    })
  }
}

import type { PrismaClient, Prisma } from 'csci32-database'

export interface ServiceDeps {
  prisma: PrismaClient
}

// Options for listing characters
export type ListCharactersOptions = {
  skip: number
  take: number
  sortField: 'createdAt' | 'name'
  sortDirection: 'asc' | 'desc'
  search?: string
}

export class CharacterService {
  constructor(private deps: ServiceDeps) {}

  // SINGLE RECORD LOOKUP
  async findOneById(id: string) {
    const { prisma } = this.deps

    return prisma.character.findUnique({
      where: { id },
      include: {
        ship: true,
        faction: true,
      },
    })
  }

  // MULTI-RECORD QUERY
  async findMany(options: ListCharactersOptions) {
    const { prisma } = this.deps
    const { search, skip, take, sortField, sortDirection } = options

    let where: Prisma.CharacterWhereInput | undefined = undefined

    if (search && search.trim().length > 0) {
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { callsign: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
          { species: { contains: search, mode: 'insensitive' } },
          { homeworld: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    return prisma.character.findMany({
      ...(where ? { where } : {}),
      orderBy: {
        [sortField]: sortDirection,
      },
      skip,
      take,
      include: {
        ship: true,
        faction: true,
      },
    })
  }
}

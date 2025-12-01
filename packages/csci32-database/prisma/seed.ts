import { PrismaClient } from '@prisma/client'
import { seedPermissions } from './seeders/seedPermissions'
import { seedRoles } from './seeders/seedRoles'
import { seedUsers } from './seeders/seedUsers'

const prisma = new PrismaClient()

// 🔹 Starwoven Datacore Character seeds
async function seedCharacters(prisma: PrismaClient) {
  console.log('✅ Seeding characters...')

  // Optional: clear old characters so seed is repeatable
  await prisma.character.deleteMany()

  await prisma.character.createMany({
    data: [
      {
        name: 'Gavin Cross',
        callsign: 'Cross',
        role: 'Captain',
        species: 'Human',
        homeworld: 'Mars',
        bio: 'Former VEIL operative and captain of the Constellation.',
      },
      {
        name: 'Sora Caddell',
        callsign: 'Sora',
        role: 'Navigator',
        species: 'Veltheri-descendant',
        homeworld: 'Veltheris',
        bio: 'Young survivor carrying a hidden Arcwave legacy in her neural implant.',
      },
      {
        name: 'Akira Konami',
        callsign: 'Override',
        role: 'Admiral',
        species: 'Human',
        homeworld: 'Earth',
        bio: 'Admiral of the USNV Override and former VEIL commander.',
      },
    ],
  })

  console.log('✅ Characters seeded.')
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Core auth/user seeds
  await seedPermissions(prisma)
  const { adminRole, basicRole } = await seedRoles(prisma)
  await seedUsers(prisma, adminRole.role_id, basicRole.role_id)

  // Starwoven Datacore seeds
  await seedCharacters(prisma)

  // Existing Post + Comment seed logic
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()

  const [author] = await prisma.user.findMany({
    select: { user_id: true },
    take: 1,
  })

  if (!author) {
    console.warn('No users found. Skipping Post seed (needs at least one user to own posts).')
    console.log('✅ Seed completed (permissions/roles/users/characters only).')
    return
  }

  const post1 = await prisma.post.create({
    data: { title: 'Hello', body: 'First post', authorId: author.user_id },
  })

  await prisma.comment.createMany({
    data: [
      { body: 'Great post!', postId: post1.id },
      { body: 'Thanks for sharing', postId: post1.id },
    ],
  })

  await prisma.post.create({
    data: {
      title: 'Nested Example',
      body: 'Created with comments',
      authorId: author.user_id,
      comments: { create: [{ body: 'Nice!' }, { body: 'Following.' }] },
    },
  })

  console.log('✅ All seeds completed successfully!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function seedUsers(prisma: PrismaClient, adminRoleId: string, basicRoleId: string) {
  const adminHash = await bcrypt.hash('admin123', 10)
  const basicHash = await bcrypt.hash('basic123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: { connect: { role_id: adminRoleId } },
    },
  })

  const basicUser = await prisma.user.upsert({
    where: { email: 'basic@example.com' },
    update: {},
    create: {
      name: 'Basic User',
      email: 'basic@example.com',
      passwordHash: basicHash,
      role: { connect: { role_id: basicRoleId } },
    },
  })

  console.log(`✅ Seeded users: ${adminUser.email}, ${basicUser.email}`)
}

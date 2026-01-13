const { prisma } = require('../lib/prisma')
const bcrypt = require('bcryptjs')

async function main() {
  await prisma.file.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'user@email.com',
      username: 'User',
      password: passwordHash,
    },
  })

  console.log('Seeded user:', user.email)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

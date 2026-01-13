const { prisma } = require('../db/prisma')
const bcrypt = require('bcryptjs')

async function main() {
  await prisma.file.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'allyn.m.smith@gmail.com',
      username: 'Allyn',
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

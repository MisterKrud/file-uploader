const prisma = require("./lib/prisma");

await prisma.file.create({
  data: {
    filename: 'test.png',
    ownerId: req.user.id,
  },
})

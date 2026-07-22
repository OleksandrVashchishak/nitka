const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('demo1234', 10);
  const r = await prisma.user.updateMany({
    where: { email: { endsWith: '@demo.local' } },
    data: { password: hash },
  });
  console.log('updated', r.count);
  await prisma.$disconnect();
}

main();

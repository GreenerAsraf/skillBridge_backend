import { prisma } from './src/lib/prisma';

async function checkAll() {
  const users = await prisma.user.findMany({
    select: { id: true, image: true }
  });

  for (const u of users) {
    if (u.image) {
      console.log(`User ${u.id}: ${u.image}`);
    }
  }
}

checkAll().finally(() => prisma.$disconnect());

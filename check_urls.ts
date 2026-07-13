import { prisma } from './src/lib/prisma';

async function checkAll() {
  const oldUrl = 'https://skillbridgebackend-production-19ba.up.railway.app';
  
  const users = await prisma.user.findMany({
    where: {
      image: {
        contains: oldUrl
      }
    }
  });

  console.log(`Users with old url: ${users.length}`);
  for (const u of users) {
    console.log(`User ${u.id}: ${u.image}`);
  }

  const blogs = await prisma.blog.findMany({
    where: {
      coverImage: {
        contains: oldUrl
      }
    }
  });
  console.log(`Blogs with old url: ${blogs.length}`);

}

checkAll().finally(() => prisma.$disconnect());

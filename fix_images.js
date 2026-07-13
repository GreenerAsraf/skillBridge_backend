const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oldUrl = 'https://skillbridgebackend-production-19ba.up.railway.app';
  const newUrl = 'https://skillbridge-backend-xm86.onrender.com';

  console.log(`Replacing ${oldUrl} with ${newUrl} in User.image...`);

  const users = await prisma.user.findMany({
    where: {
      image: {
        contains: oldUrl
      }
    }
  });

  console.log(`Found ${users.length} users to update.`);

  for (const user of users) {
    const updatedImage = user.image.replace(oldUrl, newUrl);
    await prisma.user.update({
      where: { id: user.id },
      data: { image: updatedImage }
    });
    console.log(`Updated user ${user.id}`);
  }

  console.log('Done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

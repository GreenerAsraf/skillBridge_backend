import { prisma } from './src/lib/prisma';
async function test() {
  const users = await prisma.user.findMany();
  console.log(users);
}
test();

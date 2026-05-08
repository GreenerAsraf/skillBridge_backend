import { prisma } from '../../lib/prisma';

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      status: true, 
      createdAt: true, 
      updatedAt: true 
    }
  });
  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      status: true, 
      createdAt: true, 
      updatedAt: true 
    }
  });
  return users;
};

const updateUserStatus = async (id: string, status: 'ACTIVE' | 'BLOCKED') => {
  const user = await prisma.user.update({
    where: { id },
    data: { status },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      status: true, 
      createdAt: true, 
      updatedAt: true 
    }
  });
  return user;
};

export const UserService = {
  getMe,
  getAllUsers,
  updateUserStatus
};
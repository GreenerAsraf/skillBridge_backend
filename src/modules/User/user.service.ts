import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

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

const updateProfile = async (userId: string, data: { name?: string; image?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.image ? { image: data.image } : {}),
    },
    select: { id: true, name: true, email: true, role: true, status: true, image: true },
  });
  return user;
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  // Find the account linked to this user (better-auth stores hashed passwords in Account table)
  const account = await prisma.account.findFirst({
    where: { userId },
  });

  if (!account || !account.password) {
    throw new Error('No password account found. Social-login accounts cannot change passwords here.');
  }

  const isValid = await bcrypt.compare(currentPassword, account.password);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashed },
  });

  return { success: true };
};

export const UserService = {
  getMe,
  getAllUsers,
  updateUserStatus,
  updateProfile,
  changePassword,
};
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// সিক্রেট কি `.env` ফাইল থেকে নেওয়া উচিত, তবে আপাতত হার্ডকোডেড রাখলাম
export const secret = 'lsdngkdsbfgbkdf'

const createUserIntoDB = async (payload: any) => {
  // ১. ইউজার আগে থেকেই আছে কি না চেক করা
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  })

  if (isUserExist) {
    throw new Error('User already exists!')
  }

  // ২. পাসওয়ার্ড হ্যাশ করা
  const hashPassword = await bcrypt.hash(payload.password, 8)

  // ৩. ডাটাবেসে ইউজার তৈরি করা
  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashPassword,
      role: payload.role || 'STUDENT',
      ...(payload.image ? { image: payload.image } : {}),
    },
  })

  // রেসপন্স থেকে পাসওয়ার্ড লুকিয়ে ফেলা
  const { password, ...newUser } = result
  return newUser
}

const loginUserIntoDB = async (payload: any) => {
  // ১. ইমেইল দিয়ে ইউজার খোঁজা
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  })

  if (!user) {
    throw new Error('User not found!')
  }

  // ২. পাসওয়ার্ড চেক করা
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password)

  if (!isPasswordMatched) {
    throw new Error('Invalid credentials!')
  }

  // Check if user is blocked/banned
  if (user.status === 'BLOCKED') {
    throw new Error('Your account has been blocked!')
  }

  // ৩. JWT টোকেন তৈরি করা
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  const token = jwt.sign(jwtPayload, secret, { expiresIn: '10d' })

  // রেসপন্স থেকে পাসওয়ার্ড সরানো
  const { password, ...userData } = user

  return {
    token,
    user: userData,
  }
}

export const AuthService = {
  createUserIntoDB,
  loginUserIntoDB,
}

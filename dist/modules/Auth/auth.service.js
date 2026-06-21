"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.secret = void 0;
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// সিক্রেট কি `.env` ফাইল থেকে নেওয়া উচিত, তবে আপাতত হার্ডকোডেড রাখলাম
exports.secret = 'lsdngkdsbfgbkdf';
const createUserIntoDB = async (payload) => {
    // ১. ইউজার আগে থেকেই আছে কি না চেক করা
    const isUserExist = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExist) {
        throw new Error('User already exists!');
    }
    // ২. পাসওয়ার্ড হ্যাশ করা
    const hashPassword = await bcryptjs_1.default.hash(payload.password, 8);
    // ৩. ডাটাবেসে ইউজার তৈরি করা
    const result = await prisma_1.prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashPassword,
            role: payload.role || 'STUDENT',
        },
    });
    // রেসপন্স থেকে পাসওয়ার্ড লুকিয়ে ফেলা
    const { password, ...newUser } = result;
    return newUser;
};
const loginUserIntoDB = async (payload) => {
    // ১. ইমেইল দিয়ে ইউজার খোঁজা
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new Error('User not found!');
    }
    // ২. পাসওয়ার্ড চেক করা
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Invalid credentials!');
    }
    // Check if user is blocked/banned
    if (user.status === 'BLOCKED') {
        throw new Error('Your account has been blocked!');
    }
    // ৩. JWT টোকেন তৈরি করা
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, exports.secret, { expiresIn: '10d' });
    // রেসপন্স থেকে পাসওয়ার্ড সরানো
    const { password, ...userData } = user;
    return {
        token,
        user: userData,
    };
};
exports.AuthService = {
    createUserIntoDB,
    loginUserIntoDB,
};

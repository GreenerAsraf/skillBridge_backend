"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("./prisma");
const getBaseURL = () => {
    let url = process.env.BETTER_AUTH_URL;
    if (!url) {
        return 'http://localhost:5000/api/auth';
    }
    if (url.includes('||')) {
        url = url.split('||')[0].trim();
    }
    url = url.replace(/\/$/, '');
    if (url.endsWith('/api')) {
        url = `${url}/auth`;
    }
    else if (!url.endsWith('/api/auth')) {
        url = `${url}/api/auth`;
    }
    return url;
};
const baseURL = getBaseURL();
const isSecure = baseURL.startsWith('https://');
// const prisma = new PrismaClient();
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'STUDENT'
            },
            status: {
                type: 'string',
                required: false,
                defaultValue: 'ACTIVE'
            }
        }
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL,
    advanced: {
        defaultCookieAttributes: {
            sameSite: isSecure ? 'none' : 'lax',
            secure: isSecure,
            httpOnly: true,
        }
    }
});

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'


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
  } else if (!url.endsWith('/api/auth')) {
    url = `${url}/api/auth`;
  }
  return url;
};

const baseURL = getBaseURL();
const isSecure = baseURL.startsWith('https://');

// const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma,{
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
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
})

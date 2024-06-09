import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

const authenticatedRoutes = ['/checkout', '/profile', '/orders', '/admin'];
const authenticatedAdminRoutes = ['/admin'];

const isOnAuthenticatedRoutes = (
  onRoute: string,
  authenticatedRoutes: string[]
) => {
  return authenticatedRoutes.some((authRoutes) =>
    onRoute.startsWith(authRoutes)
  );
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      // if (!userRole) return false; // No user role means unauthorized

      if (
        userRole === 'user' &&
        isOnAuthenticatedRoutes(nextUrl.pathname, authenticatedRoutes)
      ) {
        return isLoggedIn;
      }

      if (
        userRole === 'admin' &&
        isOnAuthenticatedRoutes(nextUrl.pathname, authenticatedAdminRoutes)
      ) {
        return isLoggedIn;
      }

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }

      return token;
    },
    session({ session, token }) {
      session.user = token.data as any;

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // search the email in the database
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        // compare the password
        if (!bcryptjs.compareSync(password, user.password)) {
          return null;
        }

        // return the user without the password
        const { password: _, ...rest } = user;
        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db, initPromise } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password", placeholder: "dev" },
      },
      async authorize(credentials) {
        await initPromise;

        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || password !== "dev") {
          return null;
        }

        // Find or create user
        const rows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const existing = rows[0];

        if (existing) {
          return { id: existing.id, email: existing.email, name: existing.name };
        }

        const id = uuid();
        await db.insert(users)
          .values({ id, email, name: email.split("@")[0] });

        return { id, email, name: email.split("@")[0] };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
});

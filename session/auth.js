import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, getDemoUserById, seedDemoUser } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { validateEmail } from "@/lib/utils";

/**
 * Existing Auth.js Credential Provider, extended with two flows:
 *  1. Normal email + password login (verified against users-wander).
 *  2. Passwordless hackathon demo login via demoId — only available when
 *     NEXT_PUBLIC_ENABLE_DEMO_MODE=true.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        demoId: { label: "Demo user", type: "text" },
      },
      async authorize(credentials) {
        // Demo flow — no password required, gated by the env flag.
        if (credentials?.demoId) {
          if (process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "true") return null;
          const demoUser = getDemoUserById(String(credentials.demoId));
          if (!demoUser) return null;
          await seedDemoUser(demoUser);
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            image: demoUser.avatar,
            isDemo: true,
          };
        }

        // Normal credentials flow.
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!validateEmail(email) || !password) return null;

        const user = await getUserByEmail(email);
        if (!user?.passwordHash) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
          isDemo: false,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session }) {
      // Used by proxy.js — unauthenticated users get redirected to /login.
      return Boolean(session?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isDemo = Boolean(user.isDemo);
        token.picture = user.image ?? token.picture;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isDemo = Boolean(token.isDemo);
      }
      return session;
    },
  },
});

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      if (trigger === "update") {
        if (session?.user?.name !== undefined) token.name = session.user.name;
        if (session?.name !== undefined) token.name = session.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.id || token.sub) {
          session.user.id = (token.id as string) || (token.sub as string);
        }
        if (token.name !== undefined) {
          session.user.name = token.name as string | null | undefined;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

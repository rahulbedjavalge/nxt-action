import NextAuth, { type NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.appdata",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow the configured email to sign in
      const allowedEmail = process.env.ALLOWED_EMAIL;
      if (allowedEmail && user.email !== allowedEmail) {
        return false; // Reject sign-in
      }
      return true;
    },
    async jwt({ token, account }) {
      const extendedToken = token as ExtendedJWT;
      
      // Initial sign in
      if (account) {
        return {
          ...extendedToken,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        } as ExtendedJWT;
      }

      // Return token if not expired
      if (extendedToken.expiresAt && Date.now() < extendedToken.expiresAt * 1000) {
        return extendedToken;
      }

      // Token expired, refresh it
      return refreshAccessToken(extendedToken);
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
      session.accessToken = extendedToken.accessToken;
      session.refreshToken = extendedToken.refreshToken;
      session.expiresAt = extendedToken.expiresAt;
      session.error = extendedToken.error;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

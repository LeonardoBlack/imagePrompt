// import { auth } from '@clerk/nextjs/server'

import { env } from "./env.mjs";

// Mock auth function for development
async function auth() {
  return {
    sessionClaims: null,
    userId: null,
    sessionId: null,
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    orgPermissions: null,
    getToken: async () => null,
    has: () => false,
  };
}

export async function getSessionUser() {
  const { sessionClaims } = await auth();
  if (env.ADMIN_EMAIL) {
    const adminEmails = env.ADMIN_EMAIL.split(",");
    if (sessionClaims?.user?.email) {
      sessionClaims.user.isAdmin = adminEmails.includes(sessionClaims?.user?.email);
    }
  }
  return sessionClaims?.user;
}

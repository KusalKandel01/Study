export { sql } from '@vercel/postgres';
// Swap this for a NextAuth session lookup later.
export const userId = () => Number(process.env.DEMO_USER_ID ?? 1);

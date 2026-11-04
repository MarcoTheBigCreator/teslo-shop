import env from '@next/env';
import { PrismaClient } from '@prisma/client';

env.loadEnvConfig(process.cwd());
let prisma;
try {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('connect_timeout', '5');
  prisma = new PrismaClient({ datasources: { db: { url: url.toString() } } });
  await prisma.$queryRaw`SELECT 1`;
  console.log('Database connection OK: SELECT 1 completed.');
} catch (error) {
  console.error('Database check failed (' + (error.code || error.errorCode || error.name) + '). Check DATABASE_URL and database availability.');
  process.exitCode = 1;
} finally {
  await prisma?.$disconnect();
}

import 'dotenv/config';
import 'tsconfig-paths/register';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

let prisma: PrismaClient | undefined;

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

async function runMigrations(databaseUrl: string, schemaId: string) {
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`);
  await client.query(`SET search_path TO "${schemaId}"`);

  const migrationsPath = resolve(process.cwd(), 'prisma', 'migrations');
  const migrationDirs = readdirSync(migrationsPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  for (const dir of migrationDirs) {
    const migrationScript = readFileSync(
      resolve(migrationsPath, dir, 'migration.sql'),
      'utf-8'
    );

    await client.query(migrationScript);
  }

  await client.end();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId);
  const databaseSchema =
    new URL(databaseUrl).searchParams.get('schema') ?? undefined;

  process.env.DATABASE_URL = databaseUrl;

  await runMigrations(databaseUrl, schemaId);

  prisma = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: databaseUrl },
      databaseSchema ? { schema: databaseSchema } : undefined
    ),
  });
});

afterAll(async () => {
  if (!prisma) {
    return;
  }

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

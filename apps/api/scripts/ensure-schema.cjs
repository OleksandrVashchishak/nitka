#!/usr/bin/env node
/**
 * Idempotent schema patches for Render free tier (no prisma CLI).
 */
const { PrismaClient } = require('@prisma/client');

const STATEMENTS = [
  `DO $$ BEGIN
  CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status "TaskStatus"`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP(3)`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT false`,

  `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS slug TEXT`,
  `UPDATE vendors SET slug = CONCAT('vendor-', id) WHERE slug IS NULL OR slug = ''`,

  `DO $$ BEGIN
  CREATE TYPE "ContentKind" AS ENUM ('ARTICLE', 'GUIDE', 'LANDING');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `DO $$ BEGIN
  CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `CREATE TABLE IF NOT EXISTS content_topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'spark',
  cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
)`,

  `CREATE UNIQUE INDEX IF NOT EXISTS content_topics_slug_key ON content_topics(slug)`,

  `CREATE TABLE IF NOT EXISTS content_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  kind "ContentKind" NOT NULL DEFAULT 'ARTICLE',
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  body JSONB NOT NULL DEFAULT '{}',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  og_image_url TEXT,
  city TEXT,
  vendor_category_slug TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  topic_id TEXT NOT NULL,
  author_id TEXT,
  published_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,

  `CREATE UNIQUE INDEX IF NOT EXISTS content_posts_slug_key ON content_posts(slug)`,
  `CREATE INDEX IF NOT EXISTS content_posts_status_published_at_idx ON content_posts(status, published_at)`,
  `CREATE INDEX IF NOT EXISTS content_posts_topic_id_status_idx ON content_posts(topic_id, status)`,
];

async function main() {
  const prisma = new PrismaClient();
  let ok = 0;
  let fail = 0;
  try {
    for (const sql of STATEMENTS) {
      const label = sql.replace(/\s+/g, ' ').slice(0, 72);
      try {
        await prisma.$executeRawUnsafe(sql);
        ok += 1;
        console.log('[ensure-schema] ok:', label);
      } catch (err) {
        fail += 1;
        console.warn('[ensure-schema] fail:', label, '→', err.message?.slice(0, 180));
      }
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
  console.log(`[ensure-schema] done ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error('[ensure-schema] crashed', err);
  process.exit(1);
});

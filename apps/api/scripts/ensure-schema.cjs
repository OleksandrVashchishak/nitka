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
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_reminded_at TIMESTAMP(3)`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee TEXT`,

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

  // --- Couple planning (weddings / members / guests / budget) ---
  `DO $$ BEGIN
  CREATE TYPE "WeddingMemberRole" AS ENUM ('OWNER', 'PARTNER');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `DO $$ BEGIN
  CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'YES', 'NO', 'MAYBE');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `DO $$ BEGIN
  CREATE TYPE "GuestSide" AS ENUM ('BRIDE', 'GROOM', 'BOTH', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null;
END $$`,

  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS partner_one_name TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS partner_two_name TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS couple_photo_url TEXT`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS planning_stage TEXT NOT NULL DEFAULT 'EXPLORING'`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS city_undecided BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS guests_undecided BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS day_plan JSONB`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS vendor_plan JSONB`,

  `CREATE TABLE IF NOT EXISTS wedding_members (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role "WeddingMemberRole" NOT NULL DEFAULT 'PARTNER',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS wedding_members_user_id_key ON wedding_members(user_id)`,
  `CREATE INDEX IF NOT EXISTS wedding_members_wedding_id_idx ON wedding_members(wedding_id)`,

  `CREATE TABLE IF NOT EXISTS wedding_invites (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP(3) NOT NULL,
  accepted_at TIMESTAMP(3),
  accepted_by TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS wedding_invites_token_key ON wedding_invites(token)`,
  `CREATE INDEX IF NOT EXISTS wedding_invites_wedding_id_idx ON wedding_invites(wedding_id)`,

  `CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  side "GuestSide" NOT NULL DEFAULT 'BOTH',
  rsvp_status "RsvpStatus" NOT NULL DEFAULT 'PENDING',
  plus_one BOOLEAN NOT NULL DEFAULT false,
  plus_one_name TEXT,
  plus_one_attending BOOLEAN,
  allergies TEXT,
  table_label TEXT,
  notes TEXT,
  invite_token TEXT NOT NULL,
  responded_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS guests_invite_token_key ON guests(invite_token)`,
  `CREATE INDEX IF NOT EXISTS guests_wedding_id_idx ON guests(wedding_id)`,

  `CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  estimated INTEGER NOT NULL DEFAULT 0,
  actual INTEGER NOT NULL DEFAULT 0,
  paid BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE INDEX IF NOT EXISTS budget_items_wedding_id_idx ON budget_items(wedding_id)`,
  `ALTER TABLE budget_items ADD COLUMN IF NOT EXISTS external_vendor_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS budget_items_external_vendor_id_key ON budget_items(external_vendor_id)`,

  `CREATE TABLE IF NOT EXISTS wedding_websites (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'classic',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP(3),
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `ALTER TABLE wedding_websites ADD COLUMN IF NOT EXISTS published_at TIMESTAMP(3)`,
  // Legacy rows were always created published=true; stamp once so unpublish ≠ draft.
  `DO $$
BEGIN
  IF to_regclass('public._schema_patches') IS NULL THEN
    CREATE TABLE _schema_patches (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM _schema_patches WHERE id = 'wedding_websites_published_at_v1'
  ) THEN
    UPDATE wedding_websites
    SET published_at = COALESCE(updated_at, created_at, NOW())
    WHERE published_at IS NULL;
    INSERT INTO _schema_patches (id) VALUES ('wedding_websites_published_at_v1');
  END IF;
END $$`,
  `CREATE UNIQUE INDEX IF NOT EXISTS wedding_websites_wedding_id_key ON wedding_websites(wedding_id)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS wedding_websites_slug_key ON wedding_websites(slug)`,

  `CREATE TABLE IF NOT EXISTS wedding_invitations (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'sage-linen',
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS wedding_invitations_wedding_id_key ON wedding_invitations(wedding_id)`,

  // --- Drop legacy content marketplace field ---
  `ALTER TABLE content_posts DROP COLUMN IF EXISTS vendor_category_slug`,

  // --- Drop legacy marketplace tables (idempotent) ---
  `DROP TABLE IF EXISTS request_messages`,
  `DROP TABLE IF EXISTS requests`,
  `DROP TABLE IF EXISTS favorites`,
  `DROP TABLE IF EXISTS reviews`,
  `DROP TABLE IF EXISTS vendor_views`,
  `DROP TABLE IF EXISTS vendor_faqs`,
  `DROP TABLE IF EXISTS vendor_team_members`,
  `DROP TABLE IF EXISTS vendor_packages`,
  `DROP TABLE IF EXISTS vendor_photos`,
  `DROP TABLE IF EXISTS vendors`,
  `DROP TABLE IF EXISTS categories`,

  `DO $$ BEGIN
  DROP TYPE IF EXISTS "VendorStatus";
EXCEPTION WHEN dependent_objects_still_exist THEN null;
END $$`,

  `DO $$ BEGIN
  DROP TYPE IF EXISTS "RequestStatus";
EXCEPTION WHEN dependent_objects_still_exist THEN null;
END $$`,

  // --- Shrink Role enum: ADMIN/VENDOR → COUPLE, then drop dead values ---
  `UPDATE users SET role = 'COUPLE' WHERE role::text IN ('ADMIN', 'VENDOR')`,
  `DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'Role' AND e.enumlabel IN ('ADMIN', 'VENDOR')
  ) THEN
    ALTER TYPE "Role" RENAME TO "Role_old";
    CREATE TYPE "Role" AS ENUM ('GUEST', 'COUPLE');
    ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE users
      ALTER COLUMN role TYPE "Role"
      USING role::text::"Role";
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'COUPLE'::"Role";
    DROP TYPE "Role_old";
  END IF;
END $$`,
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

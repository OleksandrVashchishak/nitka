DO $$ BEGIN
  CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status "TaskStatus";
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP(3);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT false;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tasks'
      AND column_name = 'completed'
  ) THEN
    EXECUTE $sql$
      UPDATE tasks
      SET status = CASE
        WHEN completed THEN 'DONE'::"TaskStatus"
        ELSE 'TODO'::"TaskStatus"
      END
      WHERE status IS NULL
    $sql$;
  END IF;
END $$;

ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'TODO'::"TaskStatus";
UPDATE tasks SET status = 'TODO'::"TaskStatus" WHERE status IS NULL;
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;

-- Прибираємо стару колонку до prisma db push, щоб не вимагав --accept-data-loss
ALTER TABLE tasks DROP COLUMN IF EXISTS completed;

-- Wedding membership (idempotent)
DO $$ BEGIN
  CREATE TYPE "WeddingMemberRole" AS ENUM ('OWNER', 'PARTNER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS wedding_members (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role "WeddingMemberRole" NOT NULL DEFAULT 'PARTNER',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS wedding_members_user_id_key ON wedding_members(user_id);
CREATE INDEX IF NOT EXISTS wedding_members_wedding_id_idx ON wedding_members(wedding_id);

CREATE TABLE IF NOT EXISTS wedding_invites (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP(3) NOT NULL,
  accepted_at TIMESTAMP(3),
  accepted_by TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS wedding_invites_token_key ON wedding_invites(token);
CREATE INDEX IF NOT EXISTS wedding_invites_wedding_id_idx ON wedding_invites(wedding_id);

-- Slug може ще не існувати до prisma db push — додаємо мʼяко й бекфілимо
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE vendors
SET slug = CONCAT('vendor-', id)
WHERE slug IS NULL OR slug = '';

WITH dups AS (
  SELECT id, slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) AS rn
  FROM vendors
  WHERE slug IS NOT NULL
)
UPDATE vendors v
SET slug = CONCAT(v.slug, '-', v.id)
FROM dups
WHERE v.id = dups.id AND dups.rn > 1;

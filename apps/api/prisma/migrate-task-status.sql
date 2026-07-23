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

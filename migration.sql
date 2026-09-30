-- Run once in Vercel Postgres > Query (existing database)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

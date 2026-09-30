-- Run once in Vercel dashboard > Storage > Postgres > Query
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  daily_goal_minutes INT NOT NULL DEFAULT 240
);
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'General',
  priority INT NOT NULL DEFAULT 0,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date DATE
);
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  task_id INT REFERENCES tasks(id) ON DELETE SET NULL,
  minutes INT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS daily_notes (
  user_id INT NOT NULL REFERENCES users(id),
  note_date DATE NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (user_id, note_date)
);
CREATE TABLE IF NOT EXISTS streaks (
  user_id INT PRIMARY KEY REFERENCES users(id),
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_study_date DATE
);
INSERT INTO users (id, name) VALUES (1, 'Kusal') ON CONFLICT DO NOTHING;
INSERT INTO streaks (user_id) VALUES (1) ON CONFLICT DO NOTHING;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Personal-finance planner schema.
-- Money is stored as integer cents. Currency is EUR by default.

CREATE TABLE income (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL DEFAULT '',
  amount     INTEGER NOT NULL DEFAULT 0,                 -- monthly amount, integer cents
  currency   TEXT NOT NULL DEFAULT 'EUR',
  frequency  TEXT NOT NULL DEFAULT 'Month' CHECK (frequency IN ('Month', 'Year')),
  usage      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()          -- stable ordering
);

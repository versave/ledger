-- People (just names for now) and income ownership via a holder reference.

CREATE TABLE people (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE income
  ADD COLUMN holder TEXT REFERENCES people(id) ON DELETE SET NULL;

CREATE INDEX income_holder_idx ON income(holder);

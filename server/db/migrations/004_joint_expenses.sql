-- Joint (shared) expenses. Amount is a literal (cents) OR a reference to a computed value.
-- Per-person custom splits live in a child table; absence of rows means "use the default share".

CREATE TABLE joint_expense (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER,   -- literal, integer cents
  amount_ref   TEXT,      -- or a computed-key reference (e.g. 'joint.totalRounded')
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT joint_expense_amount_one CHECK (num_nonnulls(amount_cents, amount_ref) <= 1)
);

CREATE TABLE joint_expense_split (
  expense_id TEXT NOT NULL REFERENCES joint_expense(id) ON DELETE CASCADE,
  person_id  TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  pct        NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (expense_id, person_id)
);

CREATE INDEX joint_expense_split_person_idx ON joint_expense_split(person_id);

CREATE TABLE personal_expense (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER,   -- literal, integer cents
  amount_ref   TEXT,      -- or a computed-key reference (e.g. 'jointTotal:rounded')
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT personal_expense_amount_one CHECK (num_nonnulls(amount_cents, amount_ref) <= 1)
);

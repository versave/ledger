-- Rename income.amount -> amountMonth (quoted to keep the camelCase identifier).
ALTER TABLE income RENAME COLUMN amount TO "amountMonth";

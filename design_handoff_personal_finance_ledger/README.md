# Handoff: Ledger — personal finance planner

## Overview
A single-user web app for planning personal and household finances in EUR. It replaces a set of Google Sheets with linked, editable tables. Six pages: Income, Personal spread, Joint spread, Debt, Monthly transfers, Net worth review (NWR). The core idea is **referenced values**: any amount cell can be a literal number or a live link to another computed value anywhere in the app (e.g. Personal spread income = Income total/M; a Joint spread slice feeds a Personal expense; a loan payment feeds a spread expense).

## About the design files
`Finance Ledger.dc.html` is a **design reference built in HTML** — a working prototype of look and behavior, not production code. Recreate it in the target stack (suggested if starting fresh: React + TypeScript + Vite, a small state store such as Zustand, persistence in localStorage first, IndexedDB/SQLite or a backend later). Open the HTML in a browser to explore; it runs standalone (`support.js` is the prototype runtime). The logic class at the bottom of the file (`class Component …`) contains the full computation model and is the best reference for formulas.

## Fidelity
**High-fidelity.** Colors, type, spacing, layouts and interactions are final. Recreate pixel-close; use the codebase's own component library if one exists, but keep the tokens below.

---

## Global layout
- **Shell**: CSS grid `236px | 1fr`. Below 980px viewport: single column, sidebar becomes a top bar with nav items in a wrapping row.
- **Sidebar** (fixed, full height, scrolls independently): bg `oklch(0.26 0.03 155)` (deep green), padding 22px 14px, gap 22px.
  - Brand: 30×30 tile, radius 8, bg brass `oklch(0.83 0.16 88)`, letter "L" 15px/700 in deep green; wordmark "Ledger" 18px/700 white.
  - Nav buttons: 15px, padding 10px 12px, radius 8, Lucide icon 18px stroke 1.5, gap 12. Inactive text `oklch(0.86 0.02 110)` weight 500; hover bg `oklch(0.33 0.035 155)`; **active** bg brass `oklch(0.83 0.16 88)`, text deep green, weight 600.
  - Footer note (bottom): radius 10, bg `oklch(0.33 0.035 155)`, 12px, link icon + "Link any amount to a value elsewhere and it stays in sync. Saved in this browser."
- **Main**: padding `0 clamp(14px,3vw,36px) 56px`, bg ground `oklch(0.975 0.01 95)`.
- **Page header**: flex, space-between, wraps. Left: H1 24px/700 (-0.01em), description 14px muted (60% text). Right (same row, aligned top): page actions (Edit toggle; NWR year select + H1/H2 segmented).
- **Summary cards (KPIs)**: grid with column count chosen from card count (≤5 → one row; 6 → 3 cols; 8 → 4 cols; narrow → 2). Gap 20. Card: white, 1px border `oklch(0.91 0.012 130)`, radius 10, shadow `0 1px 2px rgba(neutral-900,.05)`, padding 18px 20px. Label 11px/600 uppercase 0.1em muted; value 26px/700 tabular; sub 13px muted.
- **Content grid**: 12 columns, gap 20, `align-items:start`. Panels span `1 / -1` (full) or 6 + 6 (50/50, `align-self:stretch` so pairs are equal height).

## Panels
- **Card shell**: same as KPI card, `overflow:hidden`. Header padding 18px 22px 14px: optional kicker (11px/600 uppercase), title 18px/600, sub 13px muted. Right side: optional segmented control and/or "+ Add …" button (white, 1px border, radius 8, 13px/600, hover band color).
- **Table**: header row min-height 38, bg band `oklch(0.965 0.01 120)`, top+bottom 1px border, labels 13px/500 muted. Body rows min-height 54, 1px bottom border, hover bg band, horizontal padding 14 (+8 per cell). Footer rows min-height 46, bg band, bold totals 15px/700. Numbers right-aligned, `font-variant-numeric: tabular-nums`. Tables get `min-width` and scroll horizontally inside the card on narrow widths.
- **Donut figure** ("Where your income goes" etc.): conic-gradient ring 210px (160 small), inner hole inset 16% white with center value 19px/700 + caption 12px. 0.6% white gap between segments. Legend to the right: auto-fill grid `minmax(170px,1fr)`, each item = 10px dot + label 14px, value 14px/600 + "(xx,xx%)" muted. **Legend dots are clickable** → color popover (palette swatches + native `<input type=color>` "Custom colour"); chosen colours persist per series key.
- **Net worth over time**: grouped bar chart. Bars 76px wide, 150px plot height, radius 6 6 2 2. H1 and H2 of the same year sit 3px apart; years are 40px apart, with the year label under a hairline. Current review bar `oklch(0.40 0.05 155)`, others `oklch(0.76 0.06 140)`, negative values brass stub `oklch(0.68 0.12 70)`. Scrolls horizontally when overflowing. Header has segmented "Nominal | Today's euros".

## Cell types (all tables)
- **Name / text**: inline input, transparent; hover 1px border; focus border deep green, white bg.
- **Amount**: inline input, right-aligned. Shows formatted `€2 978,00` (NBSP thousands, comma decimals; negative uses `−`). On focus shows raw `2978,00`; commits on blur/Enter, Esc reverts. Parse accepts `1.234,56`, `1234.56`, `€ 1 234`.
  - Unlinked: input + faint link icon button (26px) → opens **Link picker**.
  - **Linked**: rendered as a button: link icon (accent) + value 15px/500, and a second line 11px accent showing the source, e.g. `Joint · Total rounded`. Click → Link picker. **In read mode linked cells keep the icon + source label** (not clickable).
- **Select**: small bordered select (Monthly/Yearly, Personal/Joint/Investments, Active/Planned/Paid off).
- **Computed**: plain right-aligned number; derived/muted values at 60% text.
- **Delete**: 28px ghost × button (edit mode only).

## Edit mode
All pages except Monthly transfers have an **Edit / Done** toggle (top right). Read mode: inputs render as plain text, no add/delete buttons, no link buttons. Monthly transfers is always editable.

## Link picker (modal)
Backdrop 40% neutral-900. Dialog 580px max, radius 12, white, padding 22. Title "Link to a value", helper text, search input (filters by group + label), list grouped by page (Income, Personal spread, Joint spread, Debt, Relative monthly transfers, NWR <title>), each row = label + current value. Current link highlighted. Actions: "Unlink, keep value" (when linked; freezes the current number) and Cancel. Excludes the cell itself; cycles resolve to NaN → "—".

---

## Pages

### 1. Income
Single table "Income sources": Name | Amount/M | Amount/Y | Frequency | Usage. User enters either M or Y; the other is derived (×12 / ÷12) and shown muted. `basis` stores which one was typed. Footer Total: **Total/M sums only Frequency=Monthly rows**; Total/Y sums all. No KPIs.

### 2. Personal spread
- KPIs: Income, Monthly expenses (+% of income), Allocated to buckets (+%), Left to assign (warns when negative), Debt-to-income (only when an expense is linked to a loan payment; bands ≤20 Healthy, ≤36 Manageable, ≤43 High, else Very high).
- Donut "Where your income goes" (full width): one slice for total recurring expenses + one per bucket + "Left to assign".
- Two equal-height panels: **Recurring monthly expenses** (Expense | Amount | Percentage % of income; footer Total monthly expenses + Post monthly expenses leftover) and **Buckets** (Bucket with colour dot | Amount | %; footer Leftover).
- Income row defaults to linked `income.totalM`; "Joint expenses slice" defaults to linked `joint.totalRounded` (or a person's rounded slice).

### 3. Joint spread
- KPIs: Combined income / month, Combined income / year, Monthly expenses (rounded, sub "Rounded from €…"), optional Debt-to-income.
- Donut "Where the joint money goes" (full width) incl. "Rounding buffer" slice.
- **Monthly expenses** (full width, above people): Expense | Amount | one "<Person> split" column per person | Split. Each person column shows `€45,00 · (75%)`. Default split = person's **rounded %**. Split toggle (checkbox in edit mode, "Custom"/"Default" tag in read mode) enables custom % per person; with 2 people editing one auto-fills the other to 100. Warn in sub if a custom split ≠ 100%. Footer: Total (actual slices per person) and Total rounded (rounded slices).
- 50/50: **People** (Person | Income/M | Income/Y | Actual % | Rounded %; footer Combined) and **Slices** (Person | Actual | Rounded; footer totals).
- Rounding: total rounded **up** to step (default 10); % rounded to step (default 5). Custom-split expenses are removed from the default pool and allocated by their own split.

### 4. Debt
- KPIs: Est. outstanding, Monthly payments (personal · joint), Yearly payments, Debt-free by.
- Donut "Balance by loan" (active loans).
- **Loans** table: Loan | Lender | Owner (Personal/Joint) | Status (Active/Planned/Paid off; tag in read mode) | Origination date (month input) | Principal | Est. outstanding (computed) | Rate % | Term (months) | Payment/M | Maturity date (computed) | Interest remaining. Footer active totals.
- **Payment ↔ term**: whichever the user edits last drives (`basis: 'pay' | 'term'`). Term → annuity payment `P·i/(1−(1+i)^−N)`. Payment → N from `−ln(1−iP/PMT)/ln(1+i)`.
- Est. outstanding after k months since origination: `P(1+i)^k − PMT((1+i)^k−1)/i`. Maturity = origination + N. Interest remaining = exact month-by-month amortization of the remaining balance (partial final payment).
- Only Active loans count in totals. Exposes linkable values `debt.<id>.payment`, `.balance`, `.original`.

### 5. Monthly transfers (always editable)
- 50/50: **Fixed recurring** (Item | Account | Amount — mostly linked to buckets/expenses) and **Monthly transfer** (items already sitting in an account, deducted).
- Transfer per account = Σ fixed(account) − Σ offsets(account). Summary cards at the **bottom**, full width: Entertainment / Personal, Joint, Investments, Total.

### 6. Net worth review (NWR)
- Header actions: **Year select** + **H1 / H2** segmented. In edit mode the select offers "<next year> (new)" and missing halves show "+ H2" to create (copy of current review).
- KPIs (4×2): Net worth (+change since previous, real change when "Today's euros"), Total assets, Total liabilities, **Monthly income (editable input in edit mode — user-defined per review)**, Total liquid, Total illiquid, Debt-to-asset, Emergency fund coverage (months = emergency holding ÷ monthly expenses; holding auto-detected by name "emergency", overridable in Ratios).
- Donut "Assets by holding" (full width).
- 50/50: **Liquid assets** and **Illiquid assets** (Asset | Value | % assets; footer totals).
- 50/50: **Liabilities** (Liability = select of loans from Debt page | Principal (auto-linked from Debt, read-only) | Outstanding balance (user-entered, defaults to the Debt estimate)) and **Ratios** (Liquid/Total, Illiquid/Total, Debt-to-asset, Emergency fund coverage).
- Net worth over time chart (see Panels).
- **Inflation & real growth** table: Review | Inflation since previous (% input) | Net worth | In <latest> euros | Nominal change | Real change. Factor for review q = Π(1+infl_j) for j>q.
- Starting a new review **freezes** the previous one (all links replaced by their current numbers) so history doesn't drift.

---

## Data model (suggested types)
```ts
type Amount = number | { ref: string };          // literal or link to a computed key
interface Row { id: string; name: string; amount: Amount }
interface IncomeRow extends Row { basis: 'm'|'y'; freq: 'Monthly'|'Yearly'; usage: string }
interface Debt extends Row { lender; owner:'Personal'|'Joint'; status:'Active'|'Planned'|'Paid off';
  original: Amount; start: 'YYYY-MM'; rate: number; payment: Amount; term?: number; basis:'pay'|'term' }
interface JointExpense extends Row { split?: Record<personId, number> }
interface Review { id; title:'H1 2026'; income: Amount; liquid: Row[]; illiquid: Row[];
  liabilities: { id; debtId; amount: Amount }[]; efId?: string; inflation?: number }
interface Data { income; personal:{income:Amount; expenses:Row[]; buckets:Row[]};
  joint:{people:Row[]; expenses:JointExpense[]}; debts:Debt[];
  transfers:{offsets:(Row&{account})[]; fixed:(Row&{account})[]}; nwr:Review[];
  colors: Record<seriesKey,string>; realView: boolean }
```
**Computation**: build a registry of computed keys (`income.totalM`, `personal.exp.<id>`, `joint.slice.<id>.r`, `debt.<id>.payment`, `nwr.<id>.net`, …) each with group, label and a lazy memoized getter; resolve `{ref}` through it with cycle detection. The registry also powers the Link picker. See `model()` in the prototype for the full key list and formulas.

Persistence in the prototype: `localStorage['ledger-finance-v1']` = `{ data, tab, nwrId }`. **Add export/import (JSON) early** — it's the user's only backup.

## Design tokens
| Token | Value |
|---|---|
| Ground | `oklch(0.975 0.01 95)` |
| Card | `#ffffff` |
| Hairline | `oklch(0.91 0.012 130)` |
| Band (table header/footer/hover) | `oklch(0.965 0.01 120)` |
| Deep green (sidebar, ink accents) | `oklch(0.26 0.03 155)` |
| Sidebar hover | `oklch(0.33 0.035 155)` |
| Sidebar text | `oklch(0.86 0.02 110)` |
| Green accent / focus | `oklch(0.40 0.05 155)`, text-on-light `oklch(0.36 0.04 155)` |
| Brass (active nav, primary toggles) | `oklch(0.83 0.16 88)` |
| Brass light (selected seg, tags) | `oklch(0.92 0.09 92)`; tint `oklch(0.965 0.05 92)` |
| Warning brass | `oklch(0.50 0.08 60)` |
| Chart palette | `0.83 0.16 88`, `0.55 0.07 150`, `0.68 0.12 70`, `0.76 0.06 140`, `0.40 0.05 150`, `0.91 0.09 95`, `0.62 0.09 112`, `0.50 0.08 60`, `0.86 0.04 140`, `0.33 0.035 155` (all oklch) |
| Remainder slice | `oklch(0.88 0.005 80)` |
| Text | `--color-text` `#1d1f20`; muted = 60% mix |
| Fonts | Barlow (body, all UI); Barlow Condensed available as `--font-heading` (from `_ds/.../styles.css`) |
| Radii | cards 10, buttons/inputs 8 / 6, pills 999 |
| Type scale | 11 (labels), 12, 13 (sub), 14–15 (cells), 18 (panel title), 24 (H1), 26 (KPI) |

## Assets
Icons: Lucide, stroke 1.5 (wallet, user, users, credit-card, arrow-left-right, landmark, link, plus, x, check, pencil). No images.

## Files
- `Finance Ledger.dc.html` — the full prototype (template markup at top, logic + formulas in `class Component` at bottom).
- `support.js` — prototype runtime, needed only to open the HTML locally.
- `_ds/…/styles.css`, `_ds_bundle.js` — base tokens and fonts used by the prototype.

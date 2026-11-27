# HomeTally — a household budget site

[![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/yiw8551/best-household-budget-site-20261126-1457-v2/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/yiw8551/best-household-budget-site-20261126-1457-v2/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

An entry to make.fun's [best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457) bounty.

**HomeTally** is the Okafor family's budget book for November 2026 — Maya, Daniel, Zoe (9) and Eli (6) — kept as a plain static site that runs entirely from its own files, on a desktop or a phone, with no network request.

## What's inside

- **Overview** — the month at a glance: money in and out, what's left to spend, a spending donut, budget health for the biggest categories, six months of cash flow, the next bills due and the nearest savings goals.
- **Budget** — the full plan against reality, category by category, shaped by the 50/30/20 rule. Every limit is editable, and every total on the site moves with it.
- **Transactions** — the complete November ledger (57 purchases plus income), with category filters, payee search, and an add-a-purchase form that updates the whole site at once.
- **Bills** — every recurring bill with its due date, autopay status and November's actual cost, plus a December calendar with each bill on its day.
- **Goals** — four savings pots (emergency fund, Kyoto trip, car replacement, home deposit) with progress rings, projected finish dates, and one-off top-ups that move the finish line immediately.
- **Insights** — month-to-month movers against October, the biggest payees, and four plain-word readings of what the numbers say.

Every figure is computed live from the ledger in `app/data.js`, so the pages can never disagree with each other.

## Layout

- `app/` — the site: `index.html`, `style.css`, and JavaScript split by job (`data.js` the family's facts, `format.js` money and dates, `charts.js` hand-drawn SVG charts, `views.js` the six pages, `main.js` the router and controls).
- `screenshots/` — four renders of the site itself: overview, budget and goals on desktop, and the overview on a phone.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library.
- `serve.ts` — a tiny local server for previewing the site (`node serve.ts`).

## License

MIT — see `LICENSE`.

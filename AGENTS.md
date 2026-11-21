# ShopLedger working rules

## Stack
- Node.js CommonJS app using Express and body-parser.
- Browser assets live in `public/`; persistent application data is `data/db.json`.

## Module map
- `routes/products.js`: product and coupon read APIs.
- `routes/orders.js`: order creation, listing, and cancellation APIs.
- `routes/customers.js`: Khata customer and settlement APIs.
- `routes/reports.js`: dashboard and audit APIs.
- `lib/store.js`: JSON database reads, writes, and audit logging.
- `lib/inventory.js`: sellable stock, stock checks, reserve/release, summaries.
- `lib/orders.js`: order records, lookup, cancellation, filtering.
- `lib/pricing.js`: checkout totals and coupon/tax calculations.
- `lib/tax.js`: HSN GST rates and CGST/SGST splits.
- `lib/coupons.js`: coupon validation and discounts.
- `lib/ledger.js`: Khata balances and settlements.
- `lib/invoice.js`: printable invoice figures and HTML.
- `lib/dates.js`: Indian date utilities.
- `lib/reports.js`: dashboard and GST reconciliation.

## Commands
- Start: `npm start`
- Tests: `node --test`

## Rules
1. Write characterization tests before changing behavior.
2. Change only modules covered by the current ticket.
3. Tests use in-memory data only; never read or write `data/db.json`.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
Stock & cancellation: only `lib/inventory.js`, `lib/orders.js` (cancel), and `test/inventory.test.js` may change.

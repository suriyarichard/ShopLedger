const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
for (const [label, items, coupon, discount, tax, total] of [
  ['mixed slabs', [[100,'1006'],[100,'0405']], '', 0, 17, 217],
  ['discount before tax', [[1020,'1006']], 'SAVE10', 102, 45.9, 963.9],
  ['capped discount', [[2240,'1006']], 'SAVE10', 150, 104.5, 2194.5],
  ['standard rate', [[100,'0902']], '', 0, 18, 118]
]) test(label, () => {
  const result = invoice.computeInvoiceFigures({items: items.map(([price,hsn])=>({price,hsn,qty:1})),coupon});
  assert.deepEqual([result.discount,result.tax,result.total],[discount,tax,total]);
  assert.equal(result.rows.reduce((sum,row)=>sum+row.lineTax,0),tax);
});

var test = require('node:test');
var assert = require('node:assert/strict');
var inventory = require('../lib/inventory');
var orders = require('../lib/orders');

function product(overrides) { return Object.assign({ id: 1, name: 'Test product', stock: 1, reserved: 0 }, overrides); }

test('repeated lines share the available stock for their product', function () {
  var items = [{id:1,qty:1},{id:1,qty:1}];
  assert.equal(inventory.check([product()], items).ok, false);
  assert.equal(inventory.check([product({stock:2})], items).ok, true);
});

test('inventory accepts an order for exactly one sellable unit', function () {
  assert.deepEqual(inventory.check([product()], [{ id: 1, qty: 1 }]), { ok: true });
});

test('inventory accepts exactly the sellable quantity when physical stock includes reservations', function () {
  assert.equal(inventory.check([product({ stock: 4, reserved: 3 })], [{ id: 1, qty: 1 }]).ok, true);
});

test('CURRENT BEHAVIOUR: inventory permits quantity zero, while excess quantity is rejected', function () {
  assert.equal(inventory.check([product()], [{ id: 1, qty: 2 }]).ok, false);
  assert.equal(inventory.check([product()], [{ id: 1, qty: 0 }]).ok, true);
});

test('cancelling a pending order restores its committed physical stock', function () {
  var db = { nextOrderId: 1, products: [product({ stock: 5, reserved: 1 })], orders: [], customers: [] };
  var items = [{ id: 1, name: 'Test product', qty: 2 }];
  inventory.reserve(db.products, items);
  var order = orders.add(db, { status: 'pending', items: items, total: 0 });
  assert.equal(db.products[0].stock, 3);
  assert.equal(orders.cancel(db, order.id).ok, true);
  assert.equal(db.products[0].stock, 5);
  assert.equal(db.products[0].reserved, 1);
});

test('correct behaviour: customer may use exactly remaining sellable stock but never more', function () {
  assert.equal(inventory.check([product()], [{ id: 1, qty: 1 }]).ok, true);
  assert.equal(inventory.check([product()], [{ id: 1, qty: 2 }]).ok, false);
});

test('correct behaviour: cancellation restores stock only once', function () {
  var db = { nextOrderId: 1, products: [product({ stock: 5 })], orders: [], customers: [] };
  var items = [{ id: 1, name: 'Test product', qty: 2 }];
  inventory.reserve(db.products, items);
  var order = orders.add(db, { status: 'pending', items: items, total: 0 });
  assert.equal(orders.cancel(db, order.id).ok, true);
  assert.equal(orders.cancel(db, order.id).ok, false);
  assert.equal(db.products[0].stock, 5);
});

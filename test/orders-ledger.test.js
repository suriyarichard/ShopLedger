const test = require('node:test');
const assert = require('node:assert/strict');
const orders = require('../lib/orders');
const ledger = require('../lib/ledger');
const db = {orders:['30/01/2022','28/12/2021','15/03/2022'].map(date=>({date}))};
test('newest first across months and years',()=>{
  assert.deepEqual(orders.list(db).map(x=>x.date),['15/03/2022','30/01/2022','28/12/2021']);
});
test('inclusive ISO date range selects January order',()=>{
  assert.deepEqual(orders.list(db,{from:'2022-01-01',to:'2022-01-30'}).map(x=>x.date),['30/01/2022']);
});
function account(){return {customers:[{id:1,openingBalance:2432.01,totalSettled:1200}],nextSettlementId:1};}
for(const amount of [500,'500']) test('settle with '+typeof amount,()=>{
  const result=ledger.recordSettlement(account(),1,amount);
  assert.equal(result.customer.balance,732.01);
  assert.equal(result.customer.totalSettled,1700);
});
test('invalid payments leave the ledger untouched',()=>{
  for(const amount of [0,-1,'x',Infinity,'',true,[]]){
    const db=account();
    assert.equal(ledger.recordSettlement(db,1,amount).ok,false);
    assert.deepEqual(db,account());
  }
});

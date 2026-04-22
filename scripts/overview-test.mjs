import assert from 'node:assert/strict';
import { buildsummaryMetrics, parseDashboardDate, getMonthKey } from '../lib/overview.js';

const currentMonthMetrics = buildsummaryMetrics({
  now: new Date('2026-03-19T12:00:00Z'),
  summary: { currentFunds: 5000 },
  donations: [
    { amount: 1000, donation_date: '2026-03-10', company_name: 'A' },
    { amount: 250, donation_date: '2026-02-10', company_name: 'B' },
  ],
  expenses: [
    { amount: 300, expense_date: '2026-03-11', description: 'Hotel' },
  ],
});
assert.equal(currentMonthMetrics.monthKey, '2026-03');
assert.equal(currentMonthMetrics.donationsThisMonth, 1000);
assert.equal(currentMonthMetrics.expensesThisMonth, 300);
assert.equal(currentMonthMetrics.netThisMonth, 700);
assert.equal(currentMonthMetrics.transactionCount, 2);

const latestActivityFallback = buildsummaryMetrics({
  now: new Date('2026-03-19T12:00:00Z'),
  summary: { currentFunds: 94100 },
  donations: [
    { amount: 100000, donation_date: '2005-11-03', company_name: 'uh' },
    { amount: 1000, donation_date: '2005-11-30T00:00:00.000Z', company_name: 'poijpoi' },
  ],
  expenses: [
    { amount: 1000, expense_date: '2005-12-01T00:00:00.000Z', description: 'Test' },
    { amount: 10000, expense_date: '2005-11-30', description: 'oij' },
  ],
});
assert.equal(latestActivityFallback.monthKey, '2005-12');
assert.equal(latestActivityFallback.donationsThisMonth, 0);
assert.equal(latestActivityFallback.expensesThisMonth, 1000);
assert.equal(latestActivityFallback.transactionCount, 1);

const slashParsed = parseDashboardDate('03/19/2026');
assert.equal(getMonthKey(slashParsed), '2026-03');

console.log('overview tests passed');

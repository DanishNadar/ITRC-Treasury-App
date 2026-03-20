function pad(value) {
  return String(value).padStart(2, '0');
}

export function parseDashboardDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  const text = String(value).trim();
  if (!text) return null;

  const isoDateMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (isoDateMatch) {
    const year = Number(isoDateMatch[1]);
    const month = Number(isoDateMatch[2]);
    const day = Number(isoDateMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function getMonthKey(dateValue) {
  const date = parseDashboardDate(dateValue);
  if (!date) return null;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function formatMonthLabelFromKey(monthKey) {
  if (!monthKey) return 'No activity yet';
  const [yearText, monthText] = String(monthKey).split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  if (!year || !month) return monthKey;
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}

function toNumber(value) {
  return Number(value || 0);
}

export function buildMonthBuckets({ donations = [], expenses = [] }) {
  const buckets = new Map();

  for (const row of donations) {
    const monthKey = getMonthKey(row.donation_date);
    if (!monthKey) continue;
    const bucket = buckets.get(monthKey) || { donations: 0, expenses: 0, donationCount: 0, expenseCount: 0 };
    bucket.donations += toNumber(row.amount);
    bucket.donationCount += 1;
    buckets.set(monthKey, bucket);
  }

  for (const row of expenses) {
    const monthKey = getMonthKey(row.expense_date);
    if (!monthKey) continue;
    const bucket = buckets.get(monthKey) || { donations: 0, expenses: 0, donationCount: 0, expenseCount: 0 };
    bucket.expenses += toNumber(row.amount);
    bucket.expenseCount += 1;
    buckets.set(monthKey, bucket);
  }

  return buckets;
}

export function chooseFocusMonth({ donations = [], expenses = [], now = new Date() }) {
  const currentMonthKey = getMonthKey(now);
  const buckets = buildMonthBuckets({ donations, expenses });

  if (currentMonthKey && buckets.has(currentMonthKey)) {
    return { monthKey: currentMonthKey, source: 'current' };
  }

  const monthKeys = [...buckets.keys()].sort();
  if (monthKeys.length) {
    return { monthKey: monthKeys[monthKeys.length - 1], source: 'latest' };
  }

  return { monthKey: currentMonthKey, source: 'current' };
}

export function buildsummaryMetrics({ donations = [], expenses = [], summary, now = new Date() }) {
  const currentFunds = Number(summary?.currentFunds || 0);
  const buckets = buildMonthBuckets({ donations, expenses });
  const focus = chooseFocusMonth({ donations, expenses, now });
  const activeBucket = focus.monthKey ? buckets.get(focus.monthKey) : null;

  const donationsThisMonth = activeBucket?.donations || 0;
  const expensesThisMonth = activeBucket?.expenses || 0;
  const donationCount = activeBucket?.donationCount || 0;
  const expenseCount = activeBucket?.expenseCount || 0;
  const transactionCount = donationCount + expenseCount;
  const netThisMonth = donationsThisMonth - expensesThisMonth;

  return {
    monthKey: focus.monthKey,
    monthLabel: formatMonthLabelFromKey(focus.monthKey),
    focusSource: focus.source,
    donationsThisMonth,
    expensesThisMonth,
    donationCount,
    expenseCount,
    transactionCount,
    netThisMonth,
    currentFunds,
  };
}

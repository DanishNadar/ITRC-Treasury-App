"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import { buildsummaryMetrics } from "@/lib/overview";

function toNumber(value) {
  return Number(value || 0);
}

function byAmountDescending(left, right) {
  return toNumber(right.amount) - toNumber(left.amount);
}

function buildLeader(rows, labelKey, fallbackLabel) {
  const totals = new Map();
  for (const row of rows) {
    const label = (row[labelKey] || fallbackLabel || "Unknown").trim() || fallbackLabel || "Unknown";
    totals.set(label, (totals.get(label) || 0) + toNumber(row.amount));
  }
  const entries = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;
  return { label: entries[0][0], amount: entries[0][1] };
}

export default function MonthlyOverview({ donations = [], expenses = [], summary }) {
  const metrics = buildsummaryMetrics({ donations, expenses, summary });

  const topSponsor = buildLeader(donations, "company_name", "Unknown sponsor");
  const topSpender = buildLeader(expenses, "person_name", "Unknown member");
  const biggestDonation = [...donations].sort(byAmountDescending)[0] || null;
  const biggestExpense = [...expenses].sort(byAmountDescending)[0] || null;

  const recentActivity = [
    ...donations.map((row) => ({
      id: row.id,
      type: "Donation",
      date: row.donation_date,
      label: row.company_name || "Donation",
      amount: toNumber(row.amount),
    })),
    ...expenses.map((row) => ({
      id: row.id,
      type: "Expense",
      date: row.expense_date,
      label: row.description || row.company_name || "Expense",
      amount: toNumber(row.amount),
    })),
  ]
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0))
    .slice(0, 4);

  const spentShare = metrics.donationsThisMonth > 0
    ? Math.min(100, (metrics.expensesThisMonth / metrics.donationsThisMonth) * 100)
    : metrics.expensesThisMonth > 0
      ? 100
      : 0;
  const reserveShare = metrics.currentFunds > 0 ? Math.min(100, (metrics.expensesThisMonth / metrics.currentFunds) * 100) : 0;

  const monthContextText = metrics.focusSource === 'latest'
    ? `Showing the latest month with activity: ${metrics.monthLabel}`
    : `Showing activity for ${metrics.monthLabel}`;

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Treasury Tracking</p>
          <h3>Treasury summary</h3>
          <p className="panelHint">{monthContextText}</p>
        </div>
        <div className="mutedPill">{metrics.transactionCount} in view</div>
      </div>

      <div className="trackerGrid">
        <article className="trackerCard net">
          <p>Net in focus month</p>
          <h4>{formatCurrency(metrics.netThisMonth)}</h4>
          <span>{metrics.netThisMonth >= 0 ? "Positive month so far" : "More spending than gains"}</span>
        </article>
        <article className="trackerCard gains">
          <p>Donations in focus month</p>
          <h4>{formatCurrency(metrics.donationsThisMonth)}</h4>
          <span>{metrics.donationCount} donation record{metrics.donationCount === 1 ? "" : "s"}</span>
        </article>
        <article className="trackerCard expenses">
          <p>Expenses in focus month</p>
          <h4>{formatCurrency(metrics.expensesThisMonth)}</h4>
          <span>{metrics.expenseCount} expense record{metrics.expenseCount === 1 ? "" : "s"}</span>
        </article>
        <article className="trackerCard reserve">
          <p>Current reserve</p>
          <h4>{formatCurrency(metrics.currentFunds)}</h4>
          <span>Live balance after gains and expenses</span>
        </article>
      </div>

      <div className="trackerSplit">
        <section className="trackerBlock">
          <div className="trackerBlockHeader">
            <h4>Pressure checks</h4>
            <p>Quick signals for spending pace</p>
          </div>
          <div className="signalRow">
            <div>
              <strong>Spend vs donations</strong>
              <span>
                {metrics.donationsThisMonth > 0
                  ? `${spentShare.toFixed(0)}% of this month's gains used`
                  : metrics.expensesThisMonth > 0
                    ? 'No donations logged in the focus month yet'
                    : 'No activity in the focus month yet'}
              </span>
            </div>
            <div className="signalBar"><span style={{ width: `${spentShare}%` }} /></div>
          </div>
          <div className="signalRow">
            <div>
              <strong>Month spend vs current reserve</strong>
              <span>{metrics.currentFunds > 0 ? `${reserveShare.toFixed(0)}% of current funds spent in the focus month` : 'No reserve logged yet'}</span>
            </div>
            <div className="signalBar reserveBar"><span style={{ width: `${reserveShare}%` }} /></div>
          </div>
          <div className="leaderGrid">
            <div className="leaderCard">
              <p>Top sponsor</p>
              <h5>{topSponsor?.label || "No sponsor data yet"}</h5>
              <span>{topSponsor ? formatCurrency(topSponsor.amount) : "Add a donation to track this"}</span>
            </div>
            <div className="leaderCard">
              <p>Top spender</p>
              <h5>{topSpender?.label || "No spending data yet"}</h5>
              <span>{topSpender ? formatCurrency(topSpender.amount) : "Add an expense to track this"}</span>
            </div>
            <div className="leaderCard">
              <p>Largest donation</p>
              <h5>{biggestDonation?.company_name || "No donation yet"}</h5>
              <span>{biggestDonation ? formatCurrency(biggestDonation.amount) : "Waiting on first donation"}</span>
            </div>
            <div className="leaderCard">
              <p>Largest expense</p>
              <h5>{biggestExpense?.description || biggestExpense?.company_name || "No expense yet"}</h5>
              <span>{biggestExpense ? formatCurrency(biggestExpense.amount) : "Waiting on first expense"}</span>
            </div>
          </div>
        </section>

        <section className="trackerBlock">
          <div className="trackerBlockHeader">
            <h4>Recent activity</h4>
            <p>The latest money movement in the club</p>
          </div>
          <div className="activityFeed">
            {recentActivity.length ? (
              recentActivity.map((item) => (
                <article key={`${item.type}-${item.id}`} className="activityItem">
                  <div>
                    <p className="activityType">{item.type}</p>
                    <h5>{item.label}</h5>
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <strong className={item.type === "Donation" ? "activityAmount gain" : "activityAmount expense"}>
                    {item.type === "Donation" ? "+" : "-"}{formatCurrency(item.amount)}
                  </strong>
                </article>
              ))
            ) : (
              <div className="emptyTrackerState">No transactions yet. Add a donation or expense to start tracking movement.</div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

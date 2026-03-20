import { NextResponse } from 'next/server';
import { getMonthlyOverview, getSummary } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { jsonError } from '@/lib/http';
export async function GET() { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const [summary, months] = await Promise.all([getSummary(), getMonthlyOverview()]); return NextResponse.json({ summary: { clubName: summary.club_name, openingBalance: Number(summary.opening_balance || 0), totalGains: Number(summary.total_gains || 0), totalExpenses: Number(summary.total_expenses || 0), currentFunds: Number(summary.current_funds || 0) }, months: months.map((item) => ({ ...item, gains: Number(item.gains || 0), expenses: Number(item.expenses || 0) })) }); } catch (error) { return jsonError(error, 'Could not load summary.'); } }

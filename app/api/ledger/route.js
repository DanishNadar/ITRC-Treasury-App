import { NextResponse } from 'next/server';
import { getLedger } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { jsonError } from '@/lib/http';
export async function GET() { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const ledger = await getLedger(); return NextResponse.json({ ledger: ledger.map((item) => ({ ...item, amount: Number(item.amount || 0) })) }); } catch (error) { return jsonError(error, 'Could not load ledger.'); } }

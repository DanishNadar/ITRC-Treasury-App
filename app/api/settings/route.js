import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { updateOpeningBalance } from '@/lib/db';
import { jsonError } from '@/lib/http';
import { parseMoney } from '@/lib/validators';
export async function PATCH(request) { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const body = await request.json(); const openingBalance = parseMoney(body.opening_balance); const updated = await updateOpeningBalance(openingBalance); return NextResponse.json({ settings: { ...updated, opening_balance: Number(updated.opening_balance || 0) } }); } catch (error) { return jsonError(error, 'Could not update settings.'); } }

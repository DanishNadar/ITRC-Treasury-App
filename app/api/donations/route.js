import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { createDonation, getDonations } from '@/lib/db';
import { jsonError } from '@/lib/http';
import { optionalText, parseMoney, requireDate, requireText } from '@/lib/validators';
export async function GET() { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const donations = await getDonations(); return NextResponse.json({ donations: donations.map((item) => ({ ...item, amount: Number(item.amount || 0) })) }); } catch (error) { return jsonError(error, 'Could not load donations.'); } }
export async function POST(request) { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const body = await request.json(); const donation = await createDonation({ amount: parseMoney(body.amount), donation_date: requireDate(body.donation_date, 'Donation date'), company_name: requireText(body.company_name, 'Company name'), company_rep: optionalText(body.company_rep), notes: optionalText(body.notes) }); return NextResponse.json({ donation: { ...donation, amount: Number(donation.amount || 0) } }); } catch (error) { return jsonError(error, 'Could not create donation.'); } }

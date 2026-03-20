import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { deleteDonation, updateDonation } from '@/lib/db';
import { ValidationError } from '@/lib/errors';
import { jsonError } from '@/lib/http';
import { optionalText, parseMoney, requireDate, requireText } from '@/lib/validators';
export async function PATCH(request, { params }) { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const body = await request.json(); const donation = await updateDonation(params.id, { amount: parseMoney(body.amount), donation_date: requireDate(body.donation_date, 'Donation date'), company_name: requireText(body.company_name, 'Company name'), company_rep: optionalText(body.company_rep), notes: optionalText(body.notes) }); if (!donation) throw new ValidationError('Donation record not found.'); return NextResponse.json({ donation: { ...donation, amount: Number(donation.amount || 0) } }); } catch (error) { return jsonError(error, 'Could not update donation.'); } }
export async function DELETE(_request, { params }) { try { const authenticated = await getSessionFromCookies(); if (!authenticated) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); const deleted = await deleteDonation(params.id); if (!deleted) throw new ValidationError('Donation record not found.'); return NextResponse.json({ ok: true, id: deleted.id }); } catch (error) { return jsonError(error, 'Could not delete donation.'); } }

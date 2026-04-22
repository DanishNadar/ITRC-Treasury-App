import { NextResponse } from 'next/server';
import { getStatusCode } from '@/lib/errors';
export function jsonError(error, fallbackMessage) { console.error(error); return NextResponse.json({ error: error?.message || fallbackMessage }, { status: getStatusCode(error) }); }

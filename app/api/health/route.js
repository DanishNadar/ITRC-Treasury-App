import { NextResponse } from 'next/server';
import { getHealthReport } from '@/lib/db';
export async function GET() { const report = await getHealthReport(); return NextResponse.json(report, { status: report.ok ? 200 : 500 }); }

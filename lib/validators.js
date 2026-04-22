import { ValidationError } from '@/lib/errors';
export function parseMoney(value) { const cleaned = String(value ?? '').replace(/[$,\s]/g, ''); const numberValue = Number(cleaned); if (!Number.isFinite(numberValue) || numberValue < 0) throw new ValidationError('Please enter a valid non-negative amount.'); return numberValue; }
export function requireText(value, fieldLabel) { const cleaned = String(value ?? '').trim(); if (!cleaned) throw new ValidationError(`${fieldLabel} is required.`); return cleaned; }
export function optionalText(value) { const cleaned = String(value ?? '').trim(); return cleaned || null; }
export function requireDate(value, fieldLabel) { const cleaned = String(value ?? '').trim(); if (!cleaned) throw new ValidationError(`${fieldLabel} is required.`); if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) throw new ValidationError(`${fieldLabel} must be in YYYY-MM-DD format.`); return cleaned; }

import { ensureSchema } from '../lib/db.js';
await ensureSchema();
console.log('Database schema applied successfully.');

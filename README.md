# Illinois Tech Railroad Club Treasury App

This build switches the database layer to `pg`, auto-creates its own tables and views on first access, supports `DATABASE_URL` or `POSTGRES_URL`, includes a single `/api/bootstrap` endpoint, and includes a `/api/health` endpoint.

## Required Vercel environment variables

- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_CLUB_NAME=Illinois Tech Railroad Club`
- one database variable: `DATABASE_URL` or `POSTGRES_URL`

## Deploy

1. Push this project to GitHub.
2. Make sure the Vercel project points to this repo and latest commit.
3. In Vercel Storage, connect a Postgres database if one is not already connected.
4. In Vercel Settings -> Environment Variables, set `ADMIN_PASSWORD` and `NEXT_PUBLIC_CLUB_NAME`.
5. Redeploy.
6. Visit `/api/health` on the live site. It should return `ok: true`.

## Local verification

```bash
npm install
npm run test:self
npm run build
```

# Release Checklist

Use this before touching Supabase remote or deploying production. The goal is to keep local, remote, and code in a known-good state.

## 1. Environment

- Confirm `.env.local` points to the intended database.
- Use Supabase local for development and E2E.
- Use Supabase remote only for controlled verification.
- Keep `RESEND_API_KEY` empty during local smoke tests unless intentionally testing real email delivery.

## 2. Database

- Run `supabase migration list` and confirm local/remote history is aligned.
- Run `supabase db push --dry-run` before applying remote migrations.
- Do not apply migrations that rewrite old foundation schema unless the current remote schema was audited.
- Keep one-off development data in `supabase/snippets/`, not in production migrations.

## 3. Automated Verification

Run the standard release verification:

```bash
pnpm verify:release
```

Optional checks:

```bash
VERIFY_RELEASE_REMOTE=1 pnpm verify:release
VERIFY_RELEASE_E2E=1 pnpm verify:release
VERIFY_RELEASE_REMOTE=1 VERIFY_RELEASE_E2E=1 pnpm verify:release
```

`VERIFY_RELEASE_E2E=1` runs the booking workflow against local Supabase by default and keeps `RESEND_API_KEY` empty.

## 4. Manual Smoke Test

- `/es/shuttles` loads and shows expected routes.
- `/es/rutas-magicas/lago-atitlan/san-pedro` loads and shows expected tours.
- `/es/internal/login` loads.
- `/es/internal/recepcion` requires auth when logged out.
- Admin panel loads when logged in.
- Notification queue shows totals, pending, sent, failed, and last processing time.

## 5. Booking Workflow

For local verification:

- Create a shuttle request.
- Create a tour request.
- Confirm both appear in the admin panel.
- Confirm `notification_jobs` records are created.
- Process pending notifications if any.
- Confirm failed jobs are visible and retryable.

## 6. Before Remote Data Changes

- Confirm the command targets remote intentionally.
- Prefer `--dry-run` first.
- Confirm `RESEND_API_KEY` behavior before creating live reservations.
- Record what changed in git or operational notes.

## 7. Rollback Notes

- For code issues, revert the commit and redeploy.
- For data-only mistakes, prefer a forward fix migration.
- For schema issues, inspect remote schema before running repair or revert commands.

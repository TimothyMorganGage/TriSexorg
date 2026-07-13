---
name: db:push blocked by untracked session table
description: Why `npm run db:push` hangs / wants to drop the express-session table, and how to push new tables safely.
---

# `npm run db:push` interactive drift on this repo

`drizzle-kit push` here is **interactive** and cannot be driven by piped stdin
(`yes ""` / `printf '\n'` do NOT work — it uses a raw TTY prompt). Drive it with a
Python `pty` that sends `\r` to accept the highlighted default for each
create-vs-rename prompt.

**Why it prompts at all:** the express-session store table (`session`, from
connect-pg-simple) exists in Postgres but was historically NOT declared in
`shared/schema.ts`. drizzle sees it as an untracked table, offers it as a bogus
"rename" source for genuinely-new tables, and — worst — flags it for **deletion**
(data-loss). The data-loss prompt defaults to "No, abort", so the whole push aborts
and your new table never gets created. `--force` does NOT fix this (it only bypasses
the data-loss confirmation, not the create/rename prompts, and would drop `session`).

**Fix (already applied):** the `session` table is now declared in `shared/schema.ts`
(sid varchar PK, sess json, expire timestamp(6), index `IDX_session_expire`). Keep it
there. With it declared, db:push no longer wants to drop it and completes cleanly once
the create/rename prompts are answered "create".

**How to apply:** to add a new table, define it in `shared/schema.ts`, then run
db:push through a pty helper that sends `\r` to each prompt. Verify with
`psql "$DATABASE_URL" -c "\d <table>"` and confirm `SELECT count(*) FROM session;`
is unchanged (should stay non-zero — active logins).

# Email Domain Setup

Status checked on 2026-04-25 for `nomadafantasma.com`.

## Current State

- DNS is managed in GoDaddy via `ns53.domaincontrol.com` and `ns54.domaincontrol.com`.
- Resend domain `nomadafantasma.com` is verified for sending.
- Public DKIM exists at `resend._domainkey.nomadafantasma.com`.
- DMARC exists at `_dmarc.nomadafantasma.com`.
- No public MX records are currently visible for `nomadafantasma.com`, so branded inboxes may not be able to receive email yet.

## Recommended Mailboxes

Start with these branded addresses, even if they all forward to one Gmail account:

- `hola@nomadafantasma.com` for public contact.
- `reservas@nomadafantasma.com` for customer booking emails.
- `operaciones@nomadafantasma.com` for internal/admin/provider notifications.

## App Environment Variables

Use these values in Vercel after the inboxes or forwards exist:

```env
RESEND_FROM=reservas@nomadafantasma.com
FROM_EMAIL=reservas@nomadafantasma.com
ADMIN_EMAIL=operaciones@nomadafantasma.com
DEFAULT_AGENCY_EMAIL=operaciones@nomadafantasma.com
NEXT_PUBLIC_CONTACT_EMAIL=hola@nomadafantasma.com
INTERNAL_ADMIN_EMAILS=hola@nomadafantasma.com,operaciones@nomadafantasma.com
```

Until `operaciones@nomadafantasma.com` can receive email, keep `ADMIN_EMAIL` pointed at a working inbox.

## Resend Sending Records

These records were reported by Resend as verified:

```txt
TXT  resend._domainkey  p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDN0Lz4Frmkaw6gL5c57ja5yoz2VaRUwQA6bHzeVief9fGK5hjqAyv1mvT6vqwevrojSofmcU0RKcj8wjIr2L66v64PWO3GuFYa9wroiXGIpwBBQFZcz55Tl3LlpYlmGlGFRZ7wXZerivB8d2vg1ISYhtcWcoFVSSLiDn3nlAFZ2wIDAQAB
MX   send               feedback-smtp.us-east-1.amazonses.com  priority 10
TXT  send               v=spf1 include:amazonses.com ~all
```

Do not remove these while Resend is used to send transactional emails.

## GoDaddy Next Steps

1. Open GoDaddy DNS for `nomadafantasma.com`.
2. Confirm whether mail is provided by GoDaddy Email, Microsoft 365, Google Workspace, Zoho, Proton, or only forwarding.
3. Create the three addresses or forwarding aliases listed above.
4. Add the provider's MX records for receiving mail at the root domain.
5. Send a test email to each branded address from an external email account.
6. Only after those tests pass, update `ADMIN_EMAIL` in Vercel to `operaciones@nomadafantasma.com`.

If GoDaddy offers automatic DNS setup for its email product, prefer that over manually guessing MX records.

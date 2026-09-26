# Orange Tickets — Development Rules

You are working on a production-oriented event ticketing platform called Orange Tickets.

## Technology

- Next.js App Router
- JavaScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Stripe
- Resend
- Vercel
- GitHub

## Core security rules

1. Never expose Supabase service-role keys to the browser.
2. Never expose Stripe secret keys to the browser.
3. Use environment variables for all secrets.
4. Treat all browser input as untrusted.
5. Use Supabase Row Level Security (RLS).
6. Never trust client-side payment success.
7. Stripe webhooks are the source of truth for payment status.
8. Stripe webhook processing must be idempotent.
9. Never allow ticket inventory to become negative.
10. Ticket scanning must use an atomic database operation.
11. QR codes must contain opaque random tokens, not personal information.
12. Hash ticket tokens where appropriate.
13. Minimize exposure of customer personal data.
14. Every protected API endpoint must verify authentication and authorization.

## Authorization

- Customers can access only their own orders and tickets.
- Organizers can access only their own organization and events.
- Event staff can scan only events they are assigned to.
- Admins can access platform administration features.

## Financial data

- Store monetary amounts as integer cents.
- Never use floating-point numbers for money.
- Store currency explicitly.
- Payment status must be controlled by verified Stripe webhook events.

## Dates

- Store timestamps in UTC.
- Store the event timezone.
- Display dates/times using the event's timezone where appropriate.

## Database

- Use migrations for database schema changes.
- Do not make production database changes manually.
- Add appropriate indexes.
- Use foreign keys and constraints where appropriate.
- Use RLS policies for protected tables.

## Ticketing

Ticket lifecycle should be explicit.

Possible ticket states include:

- valid
- scanned
- cancelled
- refunded

A ticket must not be accepted twice.

When two scanners attempt to scan the same ticket at nearly the same time, the database must prevent both scans from succeeding.

## Payments

The successful browser return from Stripe is NOT proof of payment.

The application must rely on verified Stripe webhook events.

Webhook handlers must safely handle duplicate webhook deliveries.

## Development

- Inspect existing code before modifying it.
- Do not create duplicate components, routes, or utilities.
- Prefer reusable components.
- Keep the application mobile-first.
- Include loading states.
- Include empty states.
- Include useful error states.
- Validate user input.
- Do not unnecessarily modify working functionality.
- Do not implement offline QR scanning until the online scanner is reliable and tested.

## Code quality

After significant changes:

1. Run lint.
2. Run the production build.
3. Fix errors before continuing.

Keep the architecture simple and lightweight.

Do not add unnecessary libraries.

## Product direction

Orange Tickets should support:

### Customer

Browse events → event details → select tickets → checkout → Stripe payment → ticket creation → email → QR ticket.

### Organizer

Login → dashboard → create event → create ticket types → publish → manage sales → attendees → assign door staff.

### Door staff

Login → select assigned event → scan QR → show:

- VALID
- ALREADY SCANNED
- INVALID

### Admin

Manage:

- users
- organizers
- events
- tickets
- orders
- payments
- refunds
- audit logs

## Important

Do not build the entire application in one step.

Build incrementally.

Before making major architectural changes, explain:

- what will change
- which files will change
- why the change is needed

Prefer the simplest reliable implementation.
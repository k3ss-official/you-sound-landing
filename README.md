# YOU SOUND? — teaser landing

A single-page teaser. Video first frame as the hero image, "coming soon" marquee on top, email capture bottom-right. Submit plays the video, on-end shows the thank-you state. Emails go to Cloudflare D1.

## Stack
- Next.js 14 (App Router)
- Framer Motion (animations)
- Tailwind (utilities only — no shadcn)
- Cloudflare Workers (via OpenNext adapter)
- Cloudflare D1 (SQLite) for email storage

## First-time setup

```bash
npm install
npx wrangler login
npx wrangler d1 create you-sound-subscribers
```

The `d1 create` command prints a `database_id`. Paste it into `wrangler.jsonc` where it says `PASTE_DATABASE_ID_FROM_WRANGLER_D1_CREATE_HERE`.

Then create the table:

```bash
npx wrangler d1 execute you-sound-subscribers --remote --file=./schema.sql
```

## Local dev

```bash
npm run dev
```

Note: D1 writes won't work in `next dev` — that's Next's local server, no D1 binding. Use `npm run preview` to run the built Worker locally against a local D1 sandbox, or just deploy.

## Deploy

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` then `wrangler deploy`. First deploy creates the Worker; subsequent deploys update it.

## Read the list

```bash
npx wrangler d1 execute you-sound-subscribers --remote --command="SELECT email, created_at FROM subscribers ORDER BY created_at DESC"
```

Or export to CSV:

```bash
npx wrangler d1 execute you-sound-subscribers --remote --command="SELECT email, created_at FROM subscribers" --json > subscribers.json
```

## Domain

Wire the custom domain in the Cloudflare dashboard → Workers & Pages → your worker → Settings → Triggers → Custom Domains. DNS is already on Cloudflare so it's a one-click attach.

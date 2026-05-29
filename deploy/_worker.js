// Cloudflare Pages Advanced Mode worker.
// Handles POST /api/subscribe -> D1 upsert; everything else is served as a static asset.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe') {
      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        body = null;
      }

      const email = (body && typeof body.email === 'string')
        ? body.email.trim().toLowerCase()
        : '';

      if (!email) {
        return json({ error: 'Email is required' }, 400);
      }
      if (!EMAIL_RE.test(email)) {
        return json({ error: 'Please enter a valid email address' }, 400);
      }

      try {
        // Upsert: insert, ignore if the email already exists.
        await env.DB.prepare(
          'INSERT INTO subscribers (email, created_at) VALUES (?, ?) ON CONFLICT(email) DO NOTHING'
        ).bind(email, new Date().toISOString()).run();

        return json({ message: "You're on the list!" }, 200);
      } catch (err) {
        return json({ error: 'Something went wrong. Please try again.' }, 500);
      }
    }

    // Static assets (index.html, videos, posters, etc.)
    return env.ASSETS.fetch(request);
  },
};

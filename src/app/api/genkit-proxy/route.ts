import type { NextRequest } from 'next/server';

export async function POST(request: Request) {
  const genkitUrl = process.env.GENKIT_URL;
  if (!genkitUrl) {
    return new Response(JSON.stringify({ error: 'GENKIT_URL not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.text();

    const res = await fetch(genkitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

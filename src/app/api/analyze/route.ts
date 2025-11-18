import type { NextRequest } from 'next/server';

import { runFullAnalysis } from '@/server/analysis-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chatLog: string = body?.chatLog;
    if (!chatLog || typeof chatLog !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing chatLog in request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Default: run integrated, in-process analysis (single-server mode)
    // If you explicitly want to forward to an external Genkit service, set
    // the environment variable `USE_EXTERNAL_GENKIT=true` and `GENKIT_URL`.
    const useExternal = String(process.env.USE_EXTERNAL_GENKIT || '').toLowerCase() === 'true';
    const genkitUrl = process.env.GENKIT_URL;
    if (useExternal && genkitUrl) {
      try {
        const res = await fetch(genkitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatLog }),
        });

        const text = await res.text();
        return new Response(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } });
      } catch (forwardErr: any) {
        // If forwarding fails, log and fall back to integrated analysis
        console.error('Forward to GENKIT_URL failed:', forwardErr);
      }
    }

    const result = await runFullAnalysis(chatLog);
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

import type { NextRequest } from 'next/server';

import { chatLogParsing } from '@/ai/flows/chat-log-parsing';
import { communicationAnalysis } from '@/ai/flows/communication-analysis';
import { analyzeChatMetrics } from '@/services/chat-analyzer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chatLog: string = body?.chatLog;
    if (!chatLog || typeof chatLog !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing chatLog in request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Run parsing flow (server-side)
    const parsedData = await chatLogParsing({ chatLog });

    // Deterministic calculations
    const deterministic = await analyzeChatMetrics(parsedData);

    // AI-driven communication analysis
    const aiData = await communicationAnalysis({ chatLog });

    const fullAnalysis = { ...deterministic, ...aiData };

    return new Response(JSON.stringify({ parsedData, analysis: fullAnalysis }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

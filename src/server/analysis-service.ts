"use server";

import { chatLogParsing } from '@/ai/flows/chat-log-parsing';
import { communicationAnalysis } from '@/ai/flows/communication-analysis';
import { analyzeChatMetrics } from '@/services/chat-analyzer';

export async function runFullAnalysis(chatLog: string) {
  // Parse chat log
  const parsedData = await chatLogParsing({ chatLog });

  // Deterministic calculations
  const deterministic = await analyzeChatMetrics(parsedData);

  // AI-driven analysis
  const aiData = await communicationAnalysis({ chatLog });

  const fullAnalysis = { ...deterministic, ...aiData };

  return { parsedData, analysis: fullAnalysis };
}

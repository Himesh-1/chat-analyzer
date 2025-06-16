// src/ai/flows/communication-analysis.ts
'use server';
/**
 * @fileOverview A communication analysis AI agent.
 *
 * - communicationAnalysis - A function that handles the communication analysis process.
 * - CommunicationAnalysisInput - The input type for the communicationAnalysis function.
 * - CommunicationAnalysisOutput - The return type for the communicationAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunicationAnalysisInputSchema = z.object({
  chatLog: z.string().describe('The chat log to analyze.'),
});
export type CommunicationAnalysisInput = z.infer<typeof CommunicationAnalysisInputSchema>;

const CommunicationAnalysisOutputSchema = z.object({
  totalMessagesSent: z.object({
    userA: z.number().describe('Total messages sent by user A.'),
    userB: z.number().describe('Total messages sent by user B.'),
  }).describe('Total messages sent by each user.'),
  averageResponseTime: z.object({
    userA: z.number().describe('Average response time of user A in seconds.'),
    userB: z.number().describe('Average response time of user B in seconds.'),
  }).describe('Average response time for each user.'),
  frequentWords: z.object({
    userA: z.array(z.string()).describe('Most frequently used words by user A.'),
    userB: z.array(z.string()).describe('Most frequently used words by user B.'),
  }).describe('Most frequently used words by each user.'),
  frequentEmojis: z.object({
    userA: z.array(z.string()).describe('Most frequently used emojis by user A.'),
    userB: z.array(z.string()).describe('Most frequently used emojis by user B.'),
  }).describe('Most frequently used emojis by each user.'),
  complimentCount: z.object({
    userA: z.number().describe('Number of compliments given by user A.'),
    userB: z.number().describe('Number of compliments given by user B.'),
  }).describe('Number of compliments given by each user.'),
  ghostingEvents: z.array(z.object({
    ghostedUser: z.string().describe('The user who was ghosted (A or B).'),
    startDate: z.string().describe('The start date of the ghosting event.'),
    endDate: z.string().describe('The end date of the ghosting event.'),
    durationDays: z.number().describe('The duration of the ghosting event in days.'),
  })).describe('Identified ghosting events.'),
});
export type CommunicationAnalysisOutput = z.infer<typeof CommunicationAnalysisOutputSchema>;

export async function communicationAnalysis(input: CommunicationAnalysisInput): Promise<CommunicationAnalysisOutput> {
  return communicationAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communicationAnalysisPrompt',
  input: {schema: CommunicationAnalysisInputSchema},
  output: {schema: CommunicationAnalysisOutputSchema},
  prompt: `You are an AI expert in relationship dynamics, specializing in analyzing chat logs to extract key communication metrics and patterns.

  Analyze the following chat log and extract the following information:

  - Total messages sent by each user (userA, userB).
  - Average response time for each user (userA, userB) in seconds.
  - Most frequently used words by each user (userA, userB).
  - Most frequently used emojis by each user (userA, userB).
  - Number of compliments given by each user (userA, userB).
  - Identify any ghosting events, defined as a period of no communication lasting more than 3 days. For each event, record the user who was ghosted (A or B), the start date, the end date, and the duration in days.

  Chat Log:
  {{chatLog}}

  Ensure that the output is formatted as a JSON object that adheres to the CommunicationAnalysisOutputSchema. Do not include any conversational text.
  `,
});

const communicationAnalysisFlow = ai.defineFlow(
  {
    name: 'communicationAnalysisFlow',
    inputSchema: CommunicationAnalysisInputSchema,
    outputSchema: CommunicationAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

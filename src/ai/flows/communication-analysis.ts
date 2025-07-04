
// src/ai/flows/communication-analysis.ts
'use server';
/**
 * @fileOverview A communication analysis AI agent for subjective metrics.
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
  complimentCount: z.object({
    userA: z.number().describe('Number of compliments given by User A.'),
    userB: z.number().describe('Number of compliments given by User B.'),
  }).describe('Number of compliments given by each user.'),
  ghostingEvents: z.array(z.object({
    ghostedUser: z.string().describe('The user who was ghosted (User A or User B).'),
    startDate: z.string().describe('The approximate start date of the ghosting event (YYYY-MM-DD).'),
    endDate: z.string().describe('The approximate end date of the ghosting event (YYYY-MM-DD or "Ongoing").'),
    durationDays: z.number().describe('The duration of the ghosting event in days.'),
  })).describe('Identified ghosting events (silence > 72 hours).'),

  interestLevel: z.object({
    userA: z.number().min(0).max(100).describe('Engagement percentage for User A (0-100), reflecting active participation and responsiveness.'),
    userB: z.number().min(0).max(100).describe('Engagement percentage for User B (0-100), reflecting active participation and responsiveness.'),
  }).describe('Calculated interest level or engagement percentage for each user.'),

  mentionsOfExes: z.object({
    userA: z.number().describe('Number of times User A mentioned ex-partners or past relationships.'),
    userB: z.number().describe('Number of times User B mentioned ex-partners or past relationships.'),
  }).describe('Count of mentions related to ex-partners for each user.'),

  insultCount: z.object({
    userA: z.number().describe('Number of insults, aggressive, or highly negative phrases used by User A.'),
    userB: z.number().describe('Number of insults, aggressive, or highly negative phrases used by User B.'),
  }).describe('Count of insults or overtly negative phrases used by each user.'),

  oneSidedConversationScore: z.number().min(0).max(10)
    .describe('Score from 0 (perfectly balanced) to 10 (very one-sided), indicating if one user significantly dominates the conversation.'),

  doubleTextNoReplyCount: z.object({
    userA: z.number().describe('Number of times User A sent multiple messages in a row without a reply from User B.'),
    userB: z.number().describe('Number of times User B sent multiple messages in a row without a reply from User A.'),
  }).describe('Count of instances where a user double-texted without receiving an intermediate reply.'),

  overallSentiment: z.object({
    userA: z.string().describe('Overall sentiment of messages from User A (e.g., Predominantly Positive, Mixed, Predominantly Negative, Neutral).'),
    userB: z.string().describe('Overall sentiment of messages from User B (e.g., Predominantly Positive, Mixed, Predominantly Negative, Neutral).'),
  }).describe('General sentiment expressed by each user throughout the chat.'),

  positivityNegativityRatio: z.object({
    userA: z.string().describe('Ratio/description of positive to negative toned messages for User A (e.g., "3:1 Positive", "1:2 Negative", "Balanced", "Mostly Neutral", "Insufficient data").'),
    userB: z.string().describe('Ratio/description of positive to negative toned messages for User B (e.g., "3:1 Positive", "1:2 Negative", "Balanced", "Mostly Neutral", "Insufficient data").'),
  }).describe('Ratio comparing positive versus negative messages for each user.'),

  toxicityScore: z.object({
    overall: z.number().min(0).max(10).describe('Overall toxicity score of the conversation (0 for very healthy, 10 for very toxic).'),
    userA: z.number().min(0).max(10).describe('Toxicity score reflecting User A\'s contributions (0=low, 10=high).'),
    userB: z.number().min(0).max(10).describe('Toxicity score reflecting User B\'s contributions (0=low, 10=high).'),
  }).describe('Assessment of toxicity levels in the conversation.'),

  longestMessage: z.object({
    sender: z.string().describe('The sender of the longest message (either "User A" or "User B", or "N/A" if not determinable).'),
    text: z.string().describe('The content of the longest single message (or "N/A").'),
    length: z.number().describe('The character length of the longest message (or 0).'),
  }).describe('Details about the single longest message in the chat.'),

  mostEmotionalMessage: z.object({
    sender: z.string().describe('The sender of the most emotionally charged message (either "User A" or "User B", or "N/A").'),
    text: z.string().describe('The content of the most emotional message (or "N/A").'),
    emotion: z.string().describe('The predominant emotion detected in this message (e.g., Joy, Sadness, Anger, Excitement, Frustration, Love, "N/A").'),
  }).describe('The message identified as carrying the strongest emotional content.'),

  quoteOfTheYear: z.string().optional().describe('A significant, memorable, or representative quote from the conversation. Could be funny, insightful, or impactful. "N/A" if not determinable.'),

  mostUsedPhrases: z.object({
    userA: z.array(z.string()).describe('Top 3-5 most frequently used short phrases (2-5 words) by User A, excluding very common greetings or pleasantries unless they are uniquely repetitive. "N/A" if not determinable.'),
    userB: z.array(z.string()).describe('Top 3-5 most frequently used short phrases (2-5 words) by User B, excluding very common greetings or pleasantries unless they are uniquely repetitive. "N/A" if not determinable.'),
  }).optional().describe('Most frequently used short phrases by each user.'),
  
  ghostProbabilityScore: z.number().min(0).max(100).optional().describe('An estimated probability (0-100) of ghosting occurring (or having occurred if the log is historical and shows such an event), based on communication patterns, response delays, and sentiment. Use 50 if neutral or difficult to determine.'),

  aiRelationshipSummary: z.string().describe('An AI-generated, human-like summary (can be poetic, humorous, or brutally honest) explaining the relationship dynamics, key patterns, and overall vibe. Should be 3-5 sentences.').optional(),
  
  compatibilityScore: z.number().min(0).max(100).describe('An AI-estimated compatibility score (0-100%) based on message balance, emotional reciprocation, shared interests evident in chat, tone, and ghosting history. 0 is very incompatible, 100 is highly compatible. Use 50 if neutral or difficult to determine.').optional(),
  
  conversationHealthScore: z.number().min(0).max(10).describe('A score from 0 (very unhealthy) to 10 (very healthy) assessing overall conversation health. Consider response time fairness, tone balance (positivity/negativity), toxicity levels, and respectful engagement. 0 is very unhealthy, 10 is exceptionally healthy.').optional(),
  
  sarcasmDetection: z.object({
    level: z.string().describe('Qualitative assessment of sarcasm or passive-aggressive tones (e.g., Low, Medium, High, Not Detected).'),
    example: z.string().optional().describe('A brief example of a sarcastic or passive-aggressive message if detected, otherwise "N/A".'),
  }).describe('Detection of sarcasm or passive-aggressive tones in the conversation.').optional(),

});
export type CommunicationAnalysisOutput = z.infer<typeof CommunicationAnalysisOutputSchema>;

export async function communicationAnalysis(input: CommunicationAnalysisInput): Promise<CommunicationAnalysisOutput> {
  return communicationAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communicationAnalysisPrompt',
  input: {schema: CommunicationAnalysisInputSchema},
  output: {schema: CommunicationAnalysisOutputSchema},
  prompt: `You are an AI expert in relationship dynamics and communication patterns, specializing in analyzing chat logs to extract key subjective and qualitative metrics.

Analyze the following chat log meticulously. Identify two primary participants as "User A" and "User B". If names are present, assign them consistently. If only one participant is clear, assign them as "User A" and use default/N/A values for "User B". Do NOT calculate message counts, response times, or word/emoji frequencies. Focus ONLY on the following information:

Subjective Metrics:
- Number of compliments given by each user.
- Identify any ghosting events: a period of no communication from one user to another lasting more than 3 full days (72 hours).
- Interest Level: For each user, provide an engagement percentage (0-100).
- Mentions of Exes: Count how many times each user mentions ex-partners.
- Insult Count: Count the number of insults or aggressive phrases.
- One-Sided Conversation Score: Provide a score from 0 (balanced) to 10 (one-sided).
- Double Texting & No Reply Count: Count instances of double texting.
- Overall Sentiment: Determine the sentiment for each user (e.g., 'Positive', 'Mixed', 'Negative').
- Positivity vs. Negativity Ratio: Provide a description of the ratio.
- Toxicity Score (Overall, User A, User B) from 0 to 10.

Conversation Highlights:
- Longest Message: Identify the single longest message.
- Most Emotional Message: Identify a message that is particularly emotionally charged.
- Quote of the Year: Select one short, impactful, memorable, or funny quote.
- Most Used Phrases: Identify top 3-5 most frequently used phrases (2-5 words).
- Ghost Probability Score: Estimate a probability from 0 to 100.
- AI Relationship Summary: Generate a 3-5 sentence, human-like summary.
- Compatibility Score: Estimate a score from 0 to 100.
- Conversation Health Score: Provide a score from 0 to 10.
- Sarcasm Detection: Assess the level and provide an example if applicable.

Chat Log:
{{chatLog}}

Ensure that the output is a single, valid JSON object that strictly adheres to the provided output schema. Do not include any conversational text, explanations, or apologies outside of the JSON structure.
If the chat log is too short or lacks enough interaction to determine some metrics, use appropriate default values like 0 for counts, "N/A" for strings, or neutral scores. Be robust.
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
    // Ensure output is not null and conforms to the schema.
    // The prompt guides the LLM, but runtime validation / defaults might be needed for critical fields if LLM output is unreliable.
    // For now, we trust the LLM based on the detailed prompt and schema.
    return output!;
  }
);

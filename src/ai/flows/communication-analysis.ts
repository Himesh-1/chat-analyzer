
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
    userA: z.number().describe('Total messages sent by User A.'),
    userB: z.number().describe('Total messages sent by User B.'),
  }).describe('Total messages sent by each user.'),
  averageResponseTime: z.object({
    userA: z.number().describe('Average response time of User A in seconds.'),
    userB: z.number().describe('Average response time of User B in seconds.'),
  }).describe('Average response time for each user.'),
  frequentWords: z.object({
    userA: z.array(z.string()).describe('Most frequently used words by User A (top 5-7).'),
    userB: z.array(z.string()).describe('Most frequently used words by User B (top 5-7).'),
  }).describe('Most frequently used words by each user.'),
  frequentEmojis: z.object({
    userA: z.array(z.string()).describe('Most frequently used emojis by User A (top 5-7).'),
    userB: z.array(z.string()).describe('Most frequently used emojis by User B (top 5-7).'),
  }).describe('Most frequently used emojis by each user.'),
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
  prompt: `You are an AI expert in relationship dynamics and communication patterns, specializing in analyzing chat logs to extract key communication metrics, potential red flags, and insightful highlights.

Analyze the following chat log meticulously. Identify two primary participants as "User A" and "User B". If names are present, assign them consistently. If only one participant is clear, assign them as "User A" and use default/N/A values for "User B". Extract the following information:

Existing Metrics:
- Total messages sent by each user.
- Average response time for each user in seconds. (Calculate this based on timestamps between messages from different users. If a user sends multiple messages before the other replies, consider the time until the first reply to that block. If timestamps are missing or unclear, provide 0 or a sensible default.)
- Most frequently used words by each user (top 5-7 unique words, excluding common stop words like 'the', 'a', 'is').
- Most frequently used emojis by each user (top 5-7 unique emojis).
- Number of compliments given by each user.
- Identify any ghosting events: a period of no communication from one user to another lasting more than 3 full days (72 hours). For each event, record the user who was ghosted, the approximate start date of silence (YYYY-MM-DD), the approximate end date (YYYY-MM-DD or "Ongoing" if it didn't resume by the end of the log), and the duration in days. If no ghosting, return an empty array.

New Core Analysis & Red Flags:
- Interest Level: For each user (User A, User B), provide an engagement percentage (0-100) reflecting their active participation, effort in replies, and initiation of topics. Consider factors like reply length, asking questions, and responsiveness. If unclear, use 50 as a default.
- Mentions of Exes: Count how many times each user (User A, User B) mentions ex-partners, past relationships, or dates with other people.
- Insult Count: Count the number of insults, aggressive, rude, or highly negative phrases used by each user (User A, User B).
- One-Sided Conversation Score: Provide a score from 0 (perfectly balanced) to 10 (very one-sided). This score should reflect if one user significantly dominates the conversation in terms of message volume, length, or consistently initiates topics while the other gives minimal replies. If balanced or unclear, use a score around 2-3.
- Double Texting & No Reply Count: For each user (User A, User B), count instances where they sent two or more consecutive messages without an intermediate reply from the other user, especially if the subsequent message seems like a follow-up due to lack of response.
- Overall Sentiment: Determine the overall sentiment of messages from each user (User A, User B). Categorize as 'Predominantly Positive', 'Mixed', 'Predominantly Negative', or 'Neutral'. Default to 'Neutral' if unclear.
- Positivity vs. Negativity Ratio: For each user (User A, User B), provide a simplified ratio or description comparing their positive-toned messages versus negative-toned messages (e.g., "3:1 Positive", "1:2 Negative", "Balanced", "Mostly Neutral", "Insufficient data").
- Toxicity Score:
    - Overall: A score from 0 (very healthy, respectful) to 10 (very toxic, hostile) for the entire conversation.
    - User A: A toxicity score (0-10) for User A's contributions.
    - User B: A toxicity score (0-10) for User B's contributions.
  Consider insults, passive-aggression, excessive negativity, and manipulative language. Default to low scores if content is benign.

Conversation Highlights:
- Longest Message: Identify the single longest message sent. Provide the sender ("User A" or "User B" or "N/A"), its text content (or "N/A"), and its character length (or 0).
- Most Emotional Message: Identify a message that stands out as particularly emotionally charged (positive or negative). Provide the sender ("User A" or "User B" or "N/A"), its text content (or "N/A"), and the predominant emotion detected (e.g., Joy, Sadness, Anger, Excitement, Frustration, Love, or "N/A").
- Quote of the Year: Select one short, impactful, memorable, funny, or very representative quote from the entire conversation. If none stands out, use "N/A".
- Most Used Phrases: For each user (User A, User B), identify their top 3-5 most frequently used short phrases (2-5 words long). Exclude extremely common pleasantries like "how are you" or "good morning" unless they are used with unusual frequency or in a unique way. If not determinable, return an empty array or ["N/A"].
- Ghost Probability Score: Based on the entire chat log, particularly response patterns, unanswered messages, and overall engagement, estimate a "ghost probability score" from 0 to 100. A score of 0 means very unlikely to ghost/be ghosted, 50 means neutral or hard to tell, and 100 means a very high probability or clear evidence of ghosting within the log.

NEWLY ADDED FEATURES:
- AI Relationship Summary (aiRelationshipSummary): Generate a 3-5 sentence, human-like summary of the relationship dynamics observed in the chat. This summary can adopt a poetic, humorous, or brutally honest tone, as you see fit to best capture the essence of the interaction. Focus on key patterns, overall vibe, and what the chat reveals about their connection.
- Compatibility Score (compatibilityScore): Estimate a compatibility score between User A and User B, from 0 (very incompatible) to 100 (highly compatible). Base this on factors like message balance (volume and length), emotional reciprocation (do they match each other's emotional tone?), shared interests evident in the chat, overall tone (positive/negative, supportive/critical), and ghosting history. If it's hard to determine or very neutral, assign a score around 50.
- Conversation Health Score (conversationHealthScore): Provide a score from 0 (very unhealthy) to 10 (exceptionally healthy) that assesses the overall health of the conversation. Consider factors like:
    - Fairness in response times (is one person consistently waiting much longer?).
    - Tone balance (is it generally positive, or does negativity/toxicity dominate?).
    - Levels of toxicity or aggression.
    - Respectful engagement (do they acknowledge each other, seem to listen?).
    A score of 5 can be neutral/average.
- Sarcasm Detection (sarcasmDetection):
    - level: Provide a qualitative assessment of the level of sarcasm or passive-aggressive tones in the conversation (e.g., "Not Detected", "Low", "Medium", "High").
    - example: If sarcasm/passive-aggression is detected (Medium or High), provide one brief, representative example quote from the chat. If Low or Not Detected, this can be "N/A".

Chat Log:
{{chatLog}}

Ensure that the output is a single, valid JSON object that strictly adheres to the CommunicationAnalysisOutputSchema. Do not include any conversational text, explanations, or apologies outside of the JSON structure.
If the chat log is too short or lacks enough interaction to determine some metrics (e.g., average response time, ghosting), use appropriate default values like 0 for counts, "N/A" or "Insufficient data" for strings/ratios where applicable, or a neutral/low score for scaled metrics if calculation is impossible. Be robust.
Assign "User A" and "User B" consistently. If only one user is evident, populate User A fields and use defaults for User B.
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

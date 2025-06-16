'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing chat logs to extract messages, timestamps, and sender information.
 *
 * - chatLogParsing - A function that takes chat log text as input and returns structured chat data.
 * - ChatLogParsingInput - The input type for the chatLogParsing function.
 * - ChatLogParsingOutput - The return type for the chatLogParsing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatLogParsingInputSchema = z.object({
  chatLog: z
    .string()
    .describe('The raw text content of the chat log to be parsed.'),
});
export type ChatLogParsingInput = z.infer<typeof ChatLogParsingInputSchema>;

const ChatMessageSchema = z.object({
  timestamp: z.string().describe('The timestamp of the message.'),
  sender: z.string().describe('The sender of the message.'),
  message: z.string().describe('The content of the message.'),
});

const ChatLogParsingOutputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe('An array of parsed chat messages.'),
});
export type ChatLogParsingOutput = z.infer<typeof ChatLogParsingOutputSchema>;

export async function chatLogParsing(input: ChatLogParsingInput): Promise<ChatLogParsingOutput> {
  return chatLogParsingFlow(input);
}

const correctChatLogFormat = ai.defineTool({
  name: 'correctChatLogFormat',
  description: 'Corrects the formatting of a chat log to ensure it is properly structured for parsing.',
  inputSchema: z.object({
    chatLog: z.string().describe('The chat log text that needs formatting correction.'),
  }),
  outputSchema: z.string().describe('The reformatted chat log text.'),
},
async (input) => {
  // Placeholder implementation for chat log formatting correction.
  // In a real application, this would use an LLM or rule-based system
  // to correct common formatting errors in chat logs.
  return input.chatLog;
});

const chatLogParsingPrompt = ai.definePrompt({
  name: 'chatLogParsingPrompt',
  input: {schema: ChatLogParsingInputSchema},
  output: {schema: ChatLogParsingOutputSchema},
  tools: [correctChatLogFormat],
  prompt: `You are an expert chat log analyzer. Your task is to extract messages, timestamps, and sender information from a given chat log.

  The chat log will be provided as raw text. You need to parse this text and identify individual messages, their timestamps, and the sender of each message.
  If the user has asked to correct the chatlog, call the correctChatLogFormat tool before attempting to parse the chat log.
  Here's the chat log:
  {{chatLog}}

  Return the data as an array of JSON objects.
  `,
});

const chatLogParsingFlow = ai.defineFlow(
  {
    name: 'chatLogParsingFlow',
    inputSchema: ChatLogParsingInputSchema,
    outputSchema: ChatLogParsingOutputSchema,
  },
  async input => {
    const {output} = await chatLogParsingPrompt(input);
    return output!;
  }
);

'use server';

import type { ChatLogParsingOutput } from '@/ai/flows/chat-log-parsing';

// Define the output type for this service
export interface DeterministicAnalysis {
  totalMessagesSent: { userA: number; userB: number };
  averageResponseTime: { userA: number; userB: number };
  frequentWords: {
    userA: { word: string; count: number }[];
    userB: { word:string; count: number }[];
  };
  frequentEmojis: { 
    userA: string[];
    userB: string[] 
  };
}

// Common English stop words. This list can be expanded.
const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 
  'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 
  'should', 'now', 'im', 'u', 'like', 'its', 'im', 'ur', 'ok'
]);

// Regex to find emoji
const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

/**
 * Analyzes parsed chat messages to extract deterministic metrics.
 * @param parsedData The structured chat data from the parsing flow.
 * @returns An object containing calculated metrics.
 */
export async function analyzeChatMetrics(parsedData: ChatLogParsingOutput): Promise<DeterministicAnalysis> {
  const messages = parsedData.messages;
  if (!messages || messages.length === 0) {
    // Return a default empty state if there are no messages
    return {
      totalMessagesSent: { userA: 0, userB: 0 },
      averageResponseTime: { userA: 0, userB: 0 },
      frequentWords: { userA: [], userB: [] },
      frequentEmojis: { userA: [], userB: [] },
    };
  }

  // 1. Identify User A and User B
  const senderCounts = messages.reduce((acc, msg) => {
    acc[msg.sender] = (acc[msg.sender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSenders = Object.keys(senderCounts).sort((a, b) => senderCounts[b] - senderCounts[a]);
  const userALabel = sortedSenders[0] || 'User A';
  const userBLabel = sortedSenders[1] || 'User B';

  // 2. Initialize metrics
  const totalMessagesSent = { userA: 0, userB: 0 };
  const responseTimes = { userA: [], userB: [] } as { userA: number[], userB: number[] };
  const wordCounts = { userA: new Map<string, number>(), userB: new Map<string, number>() };
  const emojiCounts = { userA: new Map<string, number>(), userB: new Map<string, number>() };
  let lastMessageTimestamp: Date | null = null;
  let lastMessageSender: string | null = null;

  // 3. Iterate through messages to calculate metrics
  for (const message of messages) {
    const currentUser = message.sender === userALabel ? 'userA' : (message.sender === userBLabel ? 'userB' : null);
    if (!currentUser) continue;

    const messageTimestamp = new Date(message.timestamp);
    if (isNaN(messageTimestamp.getTime())) continue; // Skip invalid timestamps

    // Calculate Total Messages
    totalMessagesSent[currentUser]++;

    // Calculate Average Response Time
    if (lastMessageTimestamp && lastMessageSender && lastMessageSender !== currentUser) {
      const diffSeconds = (messageTimestamp.getTime() - lastMessageTimestamp.getTime()) / 1000;
      if (diffSeconds >= 0) {
        responseTimes[currentUser].push(diffSeconds);
      }
    }
    lastMessageTimestamp = messageTimestamp;
    lastMessageSender = currentUser;

    // Collate words and emojis
    const text = message.message.toLowerCase();
    
    // Word counting
    text.replace(/[^\w\s]/g, '').split(/\s+/).forEach(word => {
      if (word && !stopWords.has(word)) {
        const counts = wordCounts[currentUser];
        counts.set(word, (counts.get(word) || 0) + 1);
      }
    });

    // Emoji counting
    const emojis = text.match(emojiRegex);
    if (emojis) {
      emojis.forEach(emoji => {
        const counts = emojiCounts[currentUser];
        counts.set(emoji, (counts.get(emoji) || 0) + 1);
      });
    }
  }

  // 4. Finalize calculations
  const calculateAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const averageResponseTime = {
    userA: calculateAverage(responseTimes.userA),
    userB: calculateAverage(responseTimes.userB),
  };
  
  const getTopItems = (map: Map<string, number>, topN = 7) => {
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
  };

  const frequentWords = {
    userA: getTopItems(wordCounts.userA).map(([word, count]) => ({ word, count })),
    userB: getTopItems(wordCounts.userB).map(([word, count]) => ({ word, count })),
  };

  const frequentEmojis = {
    userA: getTopItems(emojiCounts.userA).map(([emoji, _]) => emoji),
    userB: getTopItems(emojiCounts.userB).map(([emoji, _]) => emoji),
  };

  return { totalMessagesSent, averageResponseTime, frequentWords, frequentEmojis };
}

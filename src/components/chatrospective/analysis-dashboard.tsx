"use client";

import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { MetricCard } from './metric-card';
import { MessagesSentChart } from './charts/messages-sent-chart';
import { AvgResponseTimeChart } from './charts/avg-response-time-chart';
import { Button } from '@/components/ui/button';
import { Users, Timer, Award, MessageCircle, SmilePlus, Ghost, ArrowLeftCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisDashboardProps {
  analysisData: CommunicationAnalysisOutput;
  fileName: string | null;
  onReset: () => void;
}

function RelationshipStory({ analysisData }: { analysisData: CommunicationAnalysisOutput }) {
  const { totalMessagesSent, averageResponseTime, complimentCount, ghostingEvents } = analysisData;
  let story = `In your chat, User A sent ${totalMessagesSent.userA} messages, while User B sent ${totalMessagesSent.userB}. `;
  story += `On average, User A replied in ${averageResponseTime.userA.toFixed(1)}s and User B in ${averageResponseTime.userB.toFixed(1)}s. `;
  story += `User A gave ${complimentCount.userA} compliments, and User B offered ${complimentCount.userB}. `;
  if (ghostingEvents.length > 0) {
    story += `There were ${ghostingEvents.length} notable period(s) of silence (ghosting).`;
  } else {
    story += `It seems like communication was pretty consistent!`;
  }

  return (
    <MetricCard title="Relationship Snapshot" icon={MessageCircle}>
      <p className="text-sm text-foreground leading-relaxed">{story}</p>
    </MetricCard>
  );
}


export function AnalysisDashboard({ analysisData, fileName, onReset }: AnalysisDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-semibold text-center sm:text-left">
          Your Chat Analysis: <span className="text-primary">{fileName || "Untitled Chat"}</span>
        </h2>
        <Button onClick={onReset} variant="outline">
          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Analyze Another Chat
        </Button>
      </div>

      <RelationshipStory analysisData={analysisData} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total Messages Sent" icon={Users} chartHeight="230px">
          <MessagesSentChart data={analysisData.totalMessagesSent} />
        </MetricCard>

        <MetricCard title="Average Response Time" icon={Timer} chartHeight="230px">
          <AvgResponseTimeChart data={analysisData.averageResponseTime} />
        </MetricCard>

        <MetricCard title="Compliment Counter" icon={Award}>
          <div className="space-y-2">
            <p className="text-lg font-semibold">User A: <span className="text-primary">{analysisData.complimentCount.userA}</span></p>
            <p className="text-lg font-semibold">User B: <span className="text-primary">{analysisData.complimentCount.userB}</span></p>
          </div>
        </MetricCard>

        <MetricCard title="Most Used Words (User A)" icon={MessageCircle}>
          <ScrollArea className="h-40">
            <ul className="space-y-1 text-sm">
              {analysisData.frequentWords.userA.length > 0 ? analysisData.frequentWords.userA.map((word, i) => (
                <li key={`ua-word-${i}`} className="p-1 bg-muted/30 rounded-sm">{word}</li>
              )) : <li className="text-muted-foreground">No specific words found.</li>}
            </ul>
          </ScrollArea>
        </MetricCard>

        <MetricCard title="Most Used Words (User B)" icon={MessageCircle}>
          <ScrollArea className="h-40">
            <ul className="space-y-1 text-sm">
              {analysisData.frequentWords.userB.length > 0 ? analysisData.frequentWords.userB.map((word, i) => (
                <li key={`ub-word-${i}`} className="p-1 bg-muted/30 rounded-sm">{word}</li>
              )) : <li className="text-muted-foreground">No specific words found.</li>}
            </ul>
          </ScrollArea>
        </MetricCard>
        
        <MetricCard title="Most Used Emojis (User A)" icon={SmilePlus}>
         <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {analysisData.frequentEmojis.userA.length > 0 ? analysisData.frequentEmojis.userA.map((emoji, i) => (
              <span key={`ua-emoji-${i}`} title={emoji} className="p-1 bg-muted/30 rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>

        <MetricCard title="Most Used Emojis (User B)" icon={SmilePlus}>
          <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {analysisData.frequentEmojis.userB.length > 0 ? analysisData.frequentEmojis.userB.map((emoji, i) => (
              <span key={`ub-emoji-${i}`} title={emoji} className="p-1 bg-muted/30 rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>

        {analysisData.ghostingEvents.length > 0 && (
          <MetricCard title="Ghosting Events" icon={Ghost} className="lg:col-span-3">
            <ScrollArea className="h-48">
              <ul className="space-y-3">
                {analysisData.ghostingEvents.map((event, i) => (
                  <li key={`ghosting-${i}`} className="p-3 bg-muted/30 rounded-md shadow-sm">
                    <p className="font-semibold">Ghosted User: <span className="text-primary">{event.ghostedUser}</span></p>
                    <p className="text-xs text-muted-foreground">
                      From {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()} ({event.durationDays} days)
                    </p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </MetricCard>
        )}
      </div>
    </div>
  );
}

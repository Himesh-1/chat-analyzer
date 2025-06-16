
"use client";

import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { MetricCard } from './metric-card';
import { MessagesSentChart } from './charts/messages-sent-chart';
import { AvgResponseTimeChart } from './charts/avg-response-time-chart';
import { Button } from '@/components/ui/button';
import { 
  Users, Timer, Award, MessageCircle, SmilePlus, Ghost, ArrowLeftCircle,
  Activity, UserMinus, Angry, ShieldAlert, Baseline, Sparkles, Info,TrendingUp, Ratio, ThumbsDown, FileWarning
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AnalysisDashboardProps {
  analysisData: CommunicationAnalysisOutput;
  fileName: string | null;
  onReset: () => void;
}

function RelationshipStory({ analysisData }: { analysisData: CommunicationAnalysisOutput }) {
  const { 
    totalMessagesSent, averageResponseTime, complimentCount, ghostingEvents, 
    overallSentiment, toxicityScore, oneSidedConversationScore 
  } = analysisData;

  let story = `In your chat, User A sent ${totalMessagesSent.userA} messages, while User B sent ${totalMessagesSent.userB}. `;
  story += `On average, User A replied in ${averageResponseTime.userA?.toFixed(1) ?? 'N/A'}s and User B in ${averageResponseTime.userB?.toFixed(1) ?? 'N/A'}s. `;
  story += `User A gave ${complimentCount.userA} compliments, and User B offered ${complimentCount.userB}. `;
  
  if (overallSentiment?.userA && overallSentiment?.userB) {
    story += `User A's overall sentiment was ${overallSentiment.userA.toLowerCase()}, and User B's was ${overallSentiment.userB.toLowerCase()}. `;
  }
  if (toxicityScore?.overall !== undefined) {
    story += `The conversation had an overall toxicity score of ${toxicityScore.overall}/10. `;
  }
   if (oneSidedConversationScore !== undefined) {
    story += `The conversation balance score was ${oneSidedConversationScore}/10 (0 is balanced, 10 is one-sided). `;
  }
  if (ghostingEvents && ghostingEvents.length > 0) {
    story += `There were ${ghostingEvents.length} notable period(s) of silence.`;
  } else {
    story += `Communication seemed pretty consistent!`;
  }

  return (
    <MetricCard title="Relationship Snapshot" icon={Info}>
      <p className="text-sm text-foreground leading-relaxed">{story}</p>
    </MetricCard>
  );
}


export function AnalysisDashboard({ analysisData, fileName, onReset }: AnalysisDashboardProps) {
  const {
    totalMessagesSent, averageResponseTime, complimentCount, frequentWords, frequentEmojis, ghostingEvents,
    interestLevel, mentionsOfExes, insultCount, oneSidedConversationScore, doubleTextNoReplyCount,
    overallSentiment, positivityNegativityRatio, toxicityScore, longestMessage, mostEmotionalMessage
  } = analysisData;

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
          {totalMessagesSent && <MessagesSentChart data={totalMessagesSent} />}
        </MetricCard>

        <MetricCard title="Average Response Time" icon={Timer} chartHeight="230px">
          {averageResponseTime && <AvgResponseTimeChart data={averageResponseTime} />}
        </MetricCard>

        <MetricCard title="Compliment Counter" icon={Award}>
          <div className="space-y-2">
            <p className="text-lg font-semibold">User A: <span className="text-primary">{complimentCount?.userA ?? 'N/A'}</span></p>
            <p className="text-lg font-semibold">User B: <span className="text-primary">{complimentCount?.userB ?? 'N/A'}</span></p>
          </div>
        </MetricCard>

        {interestLevel && (
          <MetricCard title="Interest Level" icon={TrendingUp}>
            <div className="space-y-2">
              <p className="text-lg">User A: <Badge variant={interestLevel.userA > 60 ? "default" : "secondary"}>{interestLevel.userA?.toFixed(0) ?? 'N/A'}%</Badge></p>
              <p className="text-lg">User B: <Badge variant={interestLevel.userB > 60 ? "default" : "secondary"}>{interestLevel.userB?.toFixed(0) ?? 'N/A'}%</Badge></p>
            </div>
          </MetricCard>
        )}
        
        {toxicityScore && (
          <MetricCard title="Toxicity Score (0-10)" icon={FileWarning}>
            <div className="space-y-2 text-sm">
              <p>Overall: <Badge variant={toxicityScore.overall > 5 ? "destructive" : "secondary"}>{toxicityScore.overall?.toFixed(1) ?? 'N/A'}</Badge></p>
              <p>User A: <Badge variant={toxicityScore.userA > 5 ? "destructive" : "secondary"}>{toxicityScore.userA?.toFixed(1) ?? 'N/A'}</Badge></p>
              <p>User B: <Badge variant={toxicityScore.userB > 5 ? "destructive" : "secondary"}>{toxicityScore.userB?.toFixed(1) ?? 'N/A'}</Badge></p>
            </div>
          </MetricCard>
        )}

        {overallSentiment && (
          <MetricCard title="Overall Sentiment" icon={Activity}>
            <div className="space-y-2 text-sm">
              <p>User A: <span className="font-semibold text-primary">{overallSentiment.userA ?? 'N/A'}</span></p>
              <p>User B: <span className="font-semibold text-primary">{overallSentiment.userB ?? 'N/A'}</span></p>
            </div>
          </MetricCard>
        )}

        <MetricCard title="Most Used Words (User A)" icon={MessageCircle}>
          <ScrollArea className="h-40">
            <ul className="space-y-1 text-sm">
              {frequentWords?.userA && frequentWords.userA.length > 0 ? frequentWords.userA.map((word, i) => (
                <li key={`ua-word-${i}`} className="p-1 bg-muted/30 rounded-sm">{word}</li>
              )) : <li className="text-muted-foreground">No specific words found.</li>}
            </ul>
          </ScrollArea>
        </MetricCard>

        <MetricCard title="Most Used Words (User B)" icon={MessageCircle}>
          <ScrollArea className="h-40">
            <ul className="space-y-1 text-sm">
              {frequentWords?.userB && frequentWords.userB.length > 0 ? frequentWords.userB.map((word, i) => (
                <li key={`ub-word-${i}`} className="p-1 bg-muted/30 rounded-sm">{word}</li>
              )) : <li className="text-muted-foreground">No specific words found.</li>}
            </ul>
          </ScrollArea>
        </MetricCard>
        
        <MetricCard title="Most Used Emojis (User A)" icon={SmilePlus}>
         <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {frequentEmojis?.userA && frequentEmojis.userA.length > 0 ? frequentEmojis.userA.map((emoji, i) => (
              <span key={`ua-emoji-${i}`} title={emoji} className="p-1 bg-muted/30 rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>

        <MetricCard title="Most Used Emojis (User B)" icon={SmilePlus}>
          <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {frequentEmojis?.userB && frequentEmojis.userB.length > 0 ? frequentEmojis.userB.map((emoji, i) => (
              <span key={`ub-emoji-${i}`} title={emoji} className="p-1 bg-muted/30 rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>
        
        {mentionsOfExes && (
          <MetricCard title="Mentions of Exes" icon={UserMinus}>
            <div className="space-y-2">
              <p>User A: <span className="font-semibold text-primary">{mentionsOfExes.userA ?? 'N/A'}</span></p>
              <p>User B: <span className="font-semibold text-primary">{mentionsOfExes.userB ?? 'N/A'}</span></p>
            </div>
          </MetricCard>
        )}

        {insultCount && (
          <MetricCard title="Insult/Negative Phrases" icon={ThumbsDown}>
            <div className="space-y-2">
              <p>User A: <span className="font-semibold text-destructive">{insultCount.userA ?? 'N/A'}</span></p>
              <p>User B: <span className="font-semibold text-destructive">{insultCount.userB ?? 'N/A'}</span></p>
            </div>
          </MetricCard>
        )}
        
        {oneSidedConversationScore !== undefined && (
           <MetricCard title="Conversation Balance (0-10)" icon={Ratio}>
            <p className="text-xl font-bold text-primary">{oneSidedConversationScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">0 = balanced, 10 = very one-sided</p>
          </MetricCard>
        )}

        {doubleTextNoReplyCount && (
           <MetricCard title="Double Texts (No Reply)" icon={MessageCircleWarningIconAvailable() ? <MessageCircleWarning /> : <Angry /> }>
            <div className="space-y-2 text-sm">
              <p>User A: <span className="font-semibold text-primary">{doubleTextNoReplyCount.userA ?? 'N/A'}</span></p>
              <p>User B: <span className="font-semibold text-primary">{doubleTextNoReplyCount.userB ?? 'N/A'}</span></p>
            </div>
          </MetricCard>
        )}
        
        {positivityNegativityRatio && (
           <MetricCard title="Positivity/Negativity Ratio" icon={Activity}>
            <div className="space-y-2 text-sm">
              <p>User A: <span className="font-semibold text-primary">{positivityNegativityRatio.userA ?? 'N/A'}</span></p>
              <p>User B: <span className="font-semibold text-primary">{positivityNegativityRatio.userB ?? 'N/A'}</span></p>
            </div>
          </MetricCard>
        )}

        {longestMessage && longestMessage.text && longestMessage.text !== "N/A" && (
          <MetricCard title="Longest Message" icon={Baseline} className="md:col-span-2 lg:col-span-1">
             <ScrollArea className="h-40">
              <p className="text-xs text-muted-foreground">From: <span className="font-semibold text-primary">{longestMessage.sender}</span> ({longestMessage.length} chars)</p>
              <p className="mt-1 text-sm bg-muted/30 p-2 rounded-sm whitespace-pre-wrap">{longestMessage.text}</p>
            </ScrollArea>
          </MetricCard>
        )}

        {mostEmotionalMessage && mostEmotionalMessage.text && mostEmotionalMessage.text !== "N/A" && (
          <MetricCard title="Most Emotional Message" icon={Sparkles} className="md:col-span-2 lg:col-span-2">
            <ScrollArea className="h-40">
              <p className="text-xs text-muted-foreground">
                From: <span className="font-semibold text-primary">{mostEmotionalMessage.sender}</span> | Emotion: <Badge>{mostEmotionalMessage.emotion}</Badge>
              </p>
              <p className="mt-1 text-sm bg-muted/30 p-2 rounded-sm whitespace-pre-wrap">{mostEmotionalMessage.text}</p>
            </ScrollArea>
          </MetricCard>
        )}


        {ghostingEvents && ghostingEvents.length > 0 && (
          <MetricCard title="Ghosting Events" icon={Ghost} className="lg:col-span-3">
            <ScrollArea className="h-48">
              <ul className="space-y-3">
                {ghostingEvents.map((event, i) => (
                  <li key={`ghosting-${i}`} className="p-3 bg-muted/30 rounded-md shadow-sm">
                    <p className="font-semibold">Ghosted User: <span className="text-primary">{event.ghostedUser}</span></p>
                    <p className="text-xs text-muted-foreground">
                      From {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'} 
                      to {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'} 
                      ({event.durationDays ?? 'N/A'} days)
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

// Placeholder for a potentially missing icon, you might need to find an alternative or create an SVG
// For now, this function is just illustrative.
function MessageCircleWarningIconAvailable() {
  return false; // Assume it's not available by default
}

const MessageCircleWarning = () => ( // Example SVG if you needed one
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    <path d="M12 7v6"/>
    <path d="M12 16h.01"/>
  </svg>
);

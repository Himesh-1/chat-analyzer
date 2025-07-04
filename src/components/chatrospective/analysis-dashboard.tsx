
"use client";

import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { MetricCard } from './metric-card';
import { MessagesSentChart } from './charts/messages-sent-chart';
import { AvgResponseTimeChart } from './charts/avg-response-time-chart';
import { FrequentWordsChart } from './charts/frequent-words-chart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { 
  Users, Timer, Award, MessageCircle, SmilePlus, Ghost, ArrowLeftCircle,
  Activity, UserMinus, ThumbsDown, ShieldAlert, Baseline, Sparkles, Info, TrendingUp, Ratio, 
  FileWarning, MessageCircleWarning, Quote, Repeat, ShieldQuestion, Zap, Megaphone, BotMessageSquare, type LucideIcon,
  Brain, Puzzle, Gauge, Annoyed, HeartPulse, Theater
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AnalysisDashboardProps {
  analysisData: CommunicationAnalysisOutput;
  fileName: string | null;
  onReset: () => void;
}

interface RelationshipStoryProps {
  analysisData: CommunicationAnalysisOutput;
  userALabel: string;
  userBLabel: string;
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return 'N/A';
  if (seconds === 0) return '0s';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${remainingMinutes}m`;
}

function RelationshipStory({ analysisData, userALabel, userBLabel }: RelationshipStoryProps) {
  const { 
    totalMessagesSent, averageResponseTime, complimentCount, ghostingEvents, 
    overallSentiment, toxicityScore, oneSidedConversationScore 
  } = analysisData;

  let story = `In your chat, ${userALabel} sent ${totalMessagesSent.userA} messages, while ${userBLabel} sent ${totalMessagesSent.userB}. `;
  story += `On average, ${userALabel} replied in ${formatDuration(averageResponseTime.userA)} and ${userBLabel} in ${formatDuration(averageResponseTime.userB)}. `;
  story += `${userALabel} gave ${complimentCount.userA} compliments, and ${userBLabel} offered ${complimentCount.userB}. `;
  
  if (overallSentiment?.userA && overallSentiment?.userB) {
    story += `${userALabel}'s overall sentiment was ${overallSentiment.userA.toLowerCase()}, and ${userBLabel}'s was ${overallSentiment.userB.toLowerCase()}. `;
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
    <MetricCard title="Relationship Snapshot" icon={Info} className="bg-card">
      <p className="text-sm text-card-foreground leading-relaxed">{story}</p>
    </MetricCard>
  );
}

interface Achievement {
  name: string;
  description: string;
  icon: LucideIcon;
  achieved: boolean;
  user?: 'User A' | 'User B' | 'Overall';
}

function AchievementsSection({ analysisData, userALabel, userBLabel }: { analysisData: CommunicationAnalysisOutput, userALabel: string, userBLabel: string }) {
  const achievements: Achievement[] = [];

  // User A Achievements
  if (analysisData.frequentEmojis?.userA && analysisData.frequentEmojis.userA.length > 3) {
    achievements.push({ name: "Emoji Enthusiast", description: `${userALabel} loves emojis!`, icon: SmilePlus, achieved: true, user: 'User A' });
  }
  if (analysisData.complimentCount?.userA && analysisData.complimentCount.userA > 3) {
    achievements.push({ name: "Top Complimenter", description: `${userALabel} is generous with praise.`, icon: Award, achieved: true, user: 'User A' });
  }
  if (analysisData.totalMessagesSent?.userA && analysisData.totalMessagesSent.userA > 100) {
    achievements.push({ name: "Marathon Texter", description: `${userALabel} is a prolific texter.`, icon: BotMessageSquare, achieved: true, user: 'User A' });
  }
  if (analysisData.averageResponseTime?.userA && analysisData.averageResponseTime.userA < 60 && analysisData.averageResponseTime.userA > 0) {
    achievements.push({ name: "Quick Thinker", description: `${userALabel} replies lightning fast!`, icon: Zap, achieved: true, user: 'User A' });
  }

  // User B Achievements
  if (analysisData.frequentEmojis?.userB && analysisData.frequentEmojis.userB.length > 3) {
    achievements.push({ name: "Emoji Connoisseur", description: `${userBLabel} also loves emojis!`, icon: SmilePlus, achieved: true, user: 'User B' });
  }
  if (analysisData.complimentCount?.userB && analysisData.complimentCount.userB > 3) {
    achievements.push({ name: "Praise Giver", description: `${userBLabel} knows how to compliment.`, icon: Award, achieved: true, user: 'User B' });
  }
  if (analysisData.totalMessagesSent?.userB && analysisData.totalMessagesSent.userB > 100) {
    achievements.push({ name: "Chat Champion", description: `${userBLabel} keeps the chat alive.`, icon: BotMessageSquare, achieved: true, user: 'User B' });
  }
  if (analysisData.averageResponseTime?.userB && analysisData.averageResponseTime.userB < 60 && analysisData.averageResponseTime.userB > 0) {
    achievements.push({ name: "Swift Responder", description: `${userBLabel} is quick on the draw!`, icon: Zap, achieved: true, user: 'User B' });
  }
  
  // Overall/Comparative
  if (analysisData.totalMessagesSent?.userA && analysisData.totalMessagesSent?.userB) {
    if (analysisData.totalMessagesSent.userA > analysisData.totalMessagesSent.userB * 1.5) {
      achievements.push({ name: "Talkative One", description: `${userALabel} dominates the conversation volume.`, icon: Megaphone, achieved: true, user: 'User A' });
    } else if (analysisData.totalMessagesSent.userB > analysisData.totalMessagesSent.userA * 1.5) {
      achievements.push({ name: "Chief Chatterbox", description: `${userBLabel} leads in message count.`, icon: Megaphone, achieved: true, user: 'User B' });
    }
  }


  const achievedBadges = achievements.filter(a => a.achieved);

  if (achievedBadges.length === 0) {
    return (
      <MetricCard title="Chat Achievements" icon={Award} className="bg-card">
        <p className="text-sm text-muted-foreground">No specific achievements unlocked in this chat yet. Keep chatting!</p>
      </MetricCard>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 lg:col-span-3 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center text-card-foreground">
          <Award className="mr-2 h-5 w-5 text-primary" /> Chat Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievedBadges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 bg-background rounded-lg shadow-sm">
              <badge.icon className="h-10 w-10 text-primary mb-2" />
              <p className="font-semibold text-sm text-foreground">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export function AnalysisDashboard({ analysisData, fileName, onReset }: AnalysisDashboardProps) {
  const [anonymousMode, setAnonymousMode] = useState(false);

  const {
    totalMessagesSent, averageResponseTime, complimentCount, frequentWords, frequentEmojis, ghostingEvents,
    interestLevel, mentionsOfExes, insultCount, oneSidedConversationScore, doubleTextNoReplyCount,
    overallSentiment, positivityNegativityRatio, toxicityScore, longestMessage, mostEmotionalMessage,
    quoteOfTheYear, mostUsedPhrases, ghostProbabilityScore,
    aiRelationshipSummary, compatibilityScore, conversationHealthScore, sarcasmDetection
  } = analysisData;

  const userALabel = anonymousMode ? "Participant 1" : "User A";
  const userBLabel = anonymousMode ? "Participant 2" : "User B";

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-semibold text-center sm:text-left text-foreground">
          Your Chat Analysis: <span className="text-primary">{fileName || "Untitled Chat"}</span>
        </h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous-mode"
            checked={anonymousMode}
            onCheckedChange={setAnonymousMode}
          />
          <Label htmlFor="anonymous-mode" className="text-sm text-foreground">Anonymous Mode</Label>
        </div>
        <Button onClick={onReset} variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Analyze Another Chat
        </Button>
      </div>

      {aiRelationshipSummary && (
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 lg:col-span-3 bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-card-foreground">
              <Brain className="mr-2 h-6 w-6 text-primary" /> AI Relationship Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-auto max-h-48">
              <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{aiRelationshipSummary}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <RelationshipStory analysisData={analysisData} userALabel={userALabel} userBLabel={userBLabel} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total Messages Sent" icon={Users} className="bg-card">
          {totalMessagesSent && <MessagesSentChart data={totalMessagesSent} userALabel={userALabel} userBLabel={userBLabel} />}
          <div className="mt-4 flex justify-around text-center">
            <div>
              <p className="text-xl font-bold text-primary">{totalMessagesSent?.userA ?? 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{userALabel}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalMessagesSent?.userB ?? 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{userBLabel}</p>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Average Response Time" icon={Timer} className="bg-card">
          {averageResponseTime && <AvgResponseTimeChart data={averageResponseTime} userALabel={userALabel} userBLabel={userBLabel} />}
          <div className="mt-4 flex justify-around text-center">
            <div>
              <p className="text-xl font-bold text-primary">{averageResponseTime ? formatDuration(averageResponseTime.userA) : 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{userALabel}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{averageResponseTime ? formatDuration(averageResponseTime.userB) : 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{userBLabel}</p>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="Compliment Counter" icon={Award} className="bg-card">
          <div className="space-y-2">
            <div className="text-lg font-semibold text-card-foreground">{userALabel}: <span className="text-primary">{complimentCount?.userA ?? 'N/A'}</span></div>
            <div className="text-lg font-semibold text-card-foreground">{userBLabel}: <span className="text-primary">{complimentCount?.userB ?? 'N/A'}</span></div>
          </div>
        </MetricCard>

        {interestLevel && (
          <MetricCard title="Interest Level" icon={TrendingUp} className="bg-card">
            <div className="space-y-2">
              <div className="text-lg text-card-foreground">{userALabel}: <Badge variant={interestLevel.userA > 60 ? "default" : "secondary"}>{interestLevel.userA?.toFixed(0) ?? 'N/A'}%</Badge></div>
              <div className="text-lg text-card-foreground">{userBLabel}: <Badge variant={interestLevel.userB > 60 ? "default" : "secondary"}>{interestLevel.userB?.toFixed(0) ?? 'N/A'}%</Badge></div>
            </div>
          </MetricCard>
        )}
        
        {toxicityScore && (
          <MetricCard title="Toxicity Score (0-10)" icon={ShieldAlert} className="bg-card">
            <div className="space-y-2 text-sm">
              <div className="text-card-foreground">Overall: <Badge variant={toxicityScore.overall > 5 ? "destructive" : "secondary"}>{toxicityScore.overall?.toFixed(1) ?? 'N/A'}</Badge></div>
              <div className="text-card-foreground">{userALabel}: <Badge variant={toxicityScore.userA > 5 ? "destructive" : "secondary"}>{toxicityScore.userA?.toFixed(1) ?? 'N/A'}</Badge></div>
              <div className="text-card-foreground">{userBLabel}: <Badge variant={toxicityScore.userB > 5 ? "destructive" : "secondary"}>{toxicityScore.userB?.toFixed(1) ?? 'N/A'}</Badge></div>
            </div>
          </MetricCard>
        )}

        {overallSentiment && (
          <MetricCard title="Overall Sentiment" icon={Activity} className="bg-card">
            <div className="space-y-2 text-sm">
              <div className="text-card-foreground">{userALabel}: <span className="font-semibold text-primary">{overallSentiment.userA ?? 'N/A'}</span></div>
              <div className="text-card-foreground">{userBLabel}: <span className="font-semibold text-primary">{overallSentiment.userB ?? 'N/A'}</span></div>
            </div>
          </MetricCard>
        )}

        {compatibilityScore !== undefined && (
           <MetricCard title="Compatibility Score" icon={Puzzle} className="bg-card">
            <p className="text-3xl font-bold text-primary">{compatibilityScore.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">AI-estimated compatibility</p>
          </MetricCard>
        )}

        {conversationHealthScore !== undefined && (
           <MetricCard title="Conversation Health" icon={Gauge} className="bg-card">
            <p className="text-3xl font-bold text-primary">{conversationHealthScore.toFixed(1)}<span className="text-lg text-muted-foreground">/10</span></p>
            <p className="text-xs text-muted-foreground">0=unhealthy, 10=very healthy</p>
          </MetricCard>
        )}
        
        {sarcasmDetection && (
           <MetricCard title="Sarcasm/Tone Watch" icon={Annoyed} className="bg-card">
            <div className="space-y-1">
                <p className="text-md font-semibold text-card-foreground">Level: <Badge variant={sarcasmDetection.level === 'High' || sarcasmDetection.level === 'Medium' ? 'destructive': 'secondary'}>{sarcasmDetection.level ?? 'N/A'}</Badge></p>
                {sarcasmDetection.example && sarcasmDetection.example !== "N/A" && (
                    <ScrollArea className="h-20">
                        <p className="text-xs text-muted-foreground mt-1">Example: <span className="italic text-card-foreground">"{sarcasmDetection.example}"</span></p>
                    </ScrollArea>
                )}
            </div>
          </MetricCard>
        )}


        <MetricCard title={`Most Used Words (${userALabel})`} icon={MessageCircle} className="bg-card">
          <FrequentWordsChart words={frequentWords?.userA ?? []} />
        </MetricCard>

        <MetricCard title={`Most Used Words (${userBLabel})`} icon={MessageCircle} className="bg-card">
          <FrequentWordsChart words={frequentWords?.userB ?? []} />
        </MetricCard>
        
        <MetricCard title={`Most Used Emojis (${userALabel})`} icon={SmilePlus} className="bg-card">
         <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {frequentEmojis?.userA && frequentEmojis.userA.length > 0 ? frequentEmojis.userA.map((emoji, i) => (
              <span key={`ua-emoji-${i}`} title={emoji} className="p-1 bg-background rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>

        <MetricCard title={`Most Used Emojis (${userBLabel})`} icon={SmilePlus} className="bg-card">
          <ScrollArea className="h-40">
          <div className="flex flex-wrap gap-2 text-2xl">
            {frequentEmojis?.userB && frequentEmojis.userB.length > 0 ? frequentEmojis.userB.map((emoji, i) => (
              <span key={`ub-emoji-${i}`} title={emoji} className="p-1 bg-background rounded-sm">{emoji}</span>
            )) : <p className="text-sm text-muted-foreground">No specific emojis found.</p>}
          </div>
          </ScrollArea>
        </MetricCard>
        
        {mentionsOfExes && (
          <MetricCard title="Mentions of Exes" icon={UserMinus} className="bg-card">
            <div className="space-y-2">
              <div className="text-card-foreground">{userALabel}: <span className="font-semibold text-destructive">{mentionsOfExes.userA ?? 'N/A'}</span></div>
              <div className="text-card-foreground">{userBLabel}: <span className="font-semibold text-destructive">{mentionsOfExes.userB ?? 'N/A'}</span></div>
            </div>
          </MetricCard>
        )}

        {insultCount && (
          <MetricCard title="Insult/Negative Phrases" icon={ThumbsDown} className="bg-card">
            <div className="space-y-2">
              <div className="text-card-foreground">{userALabel}: <span className="font-semibold text-destructive">{insultCount.userA ?? 'N/A'}</span></div>
              <div className="text-card-foreground">{userBLabel}: <span className="font-semibold text-destructive">{insultCount.userB ?? 'N/A'}</span></div>
            </div>
          </MetricCard>
        )}
        
        {oneSidedConversationScore !== undefined && (
           <MetricCard title="Conversation Balance (0-10)" icon={Ratio} className="bg-card">
            <p className="text-xl font-bold text-primary">{oneSidedConversationScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">0 = balanced, 10 = very one-sided</p>
          </MetricCard>
        )}

        {doubleTextNoReplyCount && (
           <MetricCard title="Double Texts (No Reply)" icon={MessageCircleWarning} className="bg-card">
            <div className="space-y-2 text-sm">
              <div className="text-card-foreground">{userALabel}: <span className="font-semibold text-primary">{doubleTextNoReplyCount.userA ?? 'N/A'}</span></div>
              <div className="text-card-foreground">{userBLabel}: <span className="font-semibold text-primary">{doubleTextNoReplyCount.userB ?? 'N/A'}</span></div>
            </div>
          </MetricCard>
        )}
        
        {positivityNegativityRatio && (
           <MetricCard title="Positivity/Negativity Ratio" icon={Activity} className="bg-card">
            <div className="space-y-2 text-sm">
              <div className="text-card-foreground">{userALabel}: <span className="font-semibold text-primary">{positivityNegativityRatio.userA ?? 'N/A'}</span></div>
              <div className="text-card-foreground">{userBLabel}: <span className="font-semibold text-primary">{positivityNegativityRatio.userB ?? 'N/A'}</span></div>
            </div>
          </MetricCard>
        )}
        
        {quoteOfTheYear && quoteOfTheYear !== "N/A" && (
          <MetricCard title="Quote of the Year" icon={Quote} className="md:col-span-2 lg:col-span-1 bg-card">
            <ScrollArea className="h-40">
              <p className="text-sm bg-background p-2 rounded-sm whitespace-pre-wrap italic text-foreground">"{quoteOfTheYear}"</p>
            </ScrollArea>
          </MetricCard>
        )}

        {ghostProbabilityScore !== undefined && (
          <MetricCard title="Ghost Probability Score" icon={ShieldQuestion} className="bg-card">
            <p className="text-xl font-bold text-primary">{ghostProbabilityScore.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Likelihood of ghosting behavior</p>
          </MetricCard>
        )}

        {mostUsedPhrases?.userA && mostUsedPhrases.userA.length > 0 && mostUsedPhrases.userA[0] !== "N/A" && (
            <MetricCard title={`Most Used Phrases (${userALabel})`} icon={Repeat} className="bg-card">
                <ScrollArea className="h-40">
                    <ul className="space-y-1 text-sm">
                        {mostUsedPhrases.userA.map((phrase, i) => (
                            <li key={`ua-phrase-${i}`} className="p-1 bg-background rounded-sm text-foreground">{phrase}</li>
                        ))}
                    </ul>
                </ScrollArea>
            </MetricCard>
        )}

        {mostUsedPhrases?.userB && mostUsedPhrases.userB.length > 0 && mostUsedPhrases.userB[0] !== "N/A" && (
            <MetricCard title={`Most Used Phrases (${userBLabel})`} icon={Repeat} className="bg-card">
                <ScrollArea className="h-40">
                    <ul className="space-y-1 text-sm">
                        {mostUsedPhrases.userB.map((phrase, i) => (
                            <li key={`ub-phrase-${i}`} className="p-1 bg-background rounded-sm text-foreground">{phrase}</li>
                        ))}
                    </ul>
                </ScrollArea>
            </MetricCard>
        )}


        {longestMessage && longestMessage.text && longestMessage.text !== "N/A" && (
          <MetricCard title="Longest Message" icon={Baseline} className="md:col-span-2 lg:col-span-1 bg-card">
             <ScrollArea className="h-40">
              <p className="text-xs text-muted-foreground">From: <span className="font-semibold text-primary">{longestMessage.sender === 'User A' ? userALabel : longestMessage.sender === 'User B' ? userBLabel : longestMessage.sender}</span> ({longestMessage.length} chars)</p>
              <p className="mt-1 text-sm bg-background p-2 rounded-sm whitespace-pre-wrap text-foreground">{longestMessage.text}</p>
            </ScrollArea>
          </MetricCard>
        )}

        {mostEmotionalMessage && mostEmotionalMessage.text && mostEmotionalMessage.text !== "N/A" && (
          <MetricCard title="Most Emotional Message" icon={Sparkles} className="md:col-span-2 lg:col-span-2 bg-card">
            <ScrollArea className="h-40">
              <div className="text-xs text-muted-foreground">
                From: <span className="font-semibold text-primary">{mostEmotionalMessage.sender === 'User A' ? userALabel : mostEmotionalMessage.sender === 'User B' ? userBLabel : mostEmotionalMessage.sender}</span> | Emotion: <Badge>{mostEmotionalMessage.emotion}</Badge>
              </div>
              <p className="mt-1 text-sm bg-background p-2 rounded-sm whitespace-pre-wrap text-foreground">{mostEmotionalMessage.text}</p>
            </ScrollArea>
          </MetricCard>
        )}


        {ghostingEvents && ghostingEvents.length > 0 && (
          <MetricCard title="Ghosting Events" icon={Ghost} className="lg:col-span-3 bg-card">
            <ScrollArea className="h-48">
              <ul className="space-y-3">
                {ghostingEvents.map((event, i) => (
                  <li key={`ghosting-${i}`} className="p-3 bg-background rounded-md shadow-sm">
                    <p className="font-semibold text-foreground">Ghosted User: <span className="text-primary">{event.ghostedUser === 'User A' ? userALabel : event.ghostedUser === 'User B' ? userBLabel : event.ghostedUser}</span></p>
                    <p className="text-xs text-muted-foreground">
                      From {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'} 
                      to {event.endDate && event.endDate !== "Ongoing" ? new Date(event.endDate).toLocaleDateString() : event.endDate ?? 'N/A'} 
                      ({event.durationDays ?? 'N/A'} days)
                    </p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </MetricCard>
        )}
      </div>
      <AchievementsSection analysisData={analysisData} userALabel={userALabel} userBLabel={userBLabel} />
    </div>
  );
}

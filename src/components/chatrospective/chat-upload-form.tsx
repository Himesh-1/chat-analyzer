
"use client";

import { useState, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileText, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatUploadFormProps {
  onAnalysisComplete: (fileName: string, fileContent: string, analysisData: any, parsedData: any) => void; // Use specific types
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// These would be imported from your AI flows
import { chatLogParsing, ChatLogParsingOutput } from '@/ai/flows/chat-log-parsing';
import { communicationAnalysis, CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';

export function ChatUploadForm({ onAnalysisComplete, isLoading, setIsLoading }: ChatUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt') || selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .txt or .json file.",
        });
        setFile(null);
        setFileName(null);
        setFileContent(null);
      }
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName(null);
    setFileContent(null);
  };

  const handleSubmit = async () => {
    if (!fileContent || !fileName) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please upload a chat log file first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Parse chat log (optional based on direct need for dashboard, but good practice)
      // For now, we assume it is useful for context or future features.
      // The main analysis flow will handle the raw chat log.
      let parsedDataForCompletion: ChatLogParsingOutput = { messages: [] };
      try {
         parsedDataForCompletion = await chatLogParsing({ chatLog: fileContent });
      } catch (parseError) {
        console.warn("Chat log parsing failed, proceeding with raw content for analysis:", parseError);
        // Not critical if main analysis can handle raw log
      }


      // Step 2: Perform communication analysis
      const analysisData: CommunicationAnalysisOutput = await communicationAnalysis({ chatLog: fileContent });
      
      if (!analysisData) {
        throw new Error("Communication analysis failed to return data.");
      }

      onAnalysisComplete(fileName, fileContent, analysisData, parsedDataForCompletion);

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Upload Your Chat Log</CardTitle>
        <CardDescription>Drag & drop a .txt or .json file or click to select.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/50'}
            ${file ? 'bg-accent/20 border-accent' : ''}`}
        >
          {file ? (
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-2 font-medium text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">{file.size} bytes</p>
              <Button variant="ghost" size="sm" onClick={removeFile} className="mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive">
                <XCircle className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          ) : (
            <>
              <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="mt-2 text-sm text-muted-foreground">
                {isDragging ? "Drop it like it's hot!" : "Drag & drop or click here"}
              </p>
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.json"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload chat log file"
              />
            </>
          )}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!fileContent || isLoading}
          className="w-full text-lg py-6"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
            </>
          ) : (
            "Analyze Chat"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

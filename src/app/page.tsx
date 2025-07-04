"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChatUploadForm, type FullAnalysisOutput } from '@/components/chatrospective/chat-upload-form';
import { AnalysisDashboard } from '@/components/chatrospective/analysis-dashboard';
import { ChatHeader } from '@/components/chatrospective/chat-header';
import type { ChatLogParsingOutput } from '@/ai/flows/chat-log-parsing';
import { ThemeProvider } from "next-themes"


const LOCAL_STORAGE_KEYS = {
  FILE_NAME: 'chatrospective-file-name',
  FILE_CONTENT: 'chatrospective-file-content',
  PARSED_DATA: 'chatrospective-parsed-data',
  ANALYSIS_DATA: 'chatrospective-analysis-data',
};

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ChatLogParsingOutput | null>(null);
  const [analysisData, setAnalysisData] = useState<FullAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedFileName = localStorage.getItem(LOCAL_STORAGE_KEYS.FILE_NAME);
      const storedFileContent = localStorage.getItem(LOCAL_STORAGE_KEYS.FILE_CONTENT);
      const storedParsedData = localStorage.getItem(LOCAL_STORAGE_KEYS.PARSED_DATA);
      const storedAnalysisData = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYSIS_DATA);

      if (storedFileName && storedFileContent && storedParsedData && storedAnalysisData) {
        setFileName(storedFileName);
        setFileContent(storedFileContent);
        setParsedData(JSON.parse(storedParsedData));
        setAnalysisData(JSON.parse(storedAnalysisData));
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
      // Clear potentially corrupted data
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    }
    setIsInitialized(true);
  }, []);

  const handleAnalysisComplete = useCallback(
    (
      uploadedFileName: string,
      uploadedFileContent: string,
      completedAnalysisData: FullAnalysisOutput,
      completedParsedData: ChatLogParsingOutput
    ) => {
      setFileName(uploadedFileName);
      setFileContent(uploadedFileContent);
      setAnalysisData(completedAnalysisData);
      setParsedData(completedParsedData);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.FILE_NAME, uploadedFileName);
        localStorage.setItem(LOCAL_STORAGE_KEYS.FILE_CONTENT, uploadedFileContent);
        localStorage.setItem(LOCAL_STORAGE_KEYS.PARSED_DATA, JSON.stringify(completedParsedData));
        localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYSIS_DATA, JSON.stringify(completedAnalysisData));
      } catch (error) {
        console.error("Error saving to local storage:", error);
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setFileName(null);
    setFileContent(null);
    setParsedData(null);
    setAnalysisData(null);
    setIsLoading(false);
    try {
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex-grow flex items-center justify-center">
        {/* Optional: Add a global loading spinner here if initialization takes time */}
      </div>
    );
  }
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <ChatHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {analysisData && fileName ? (
            <AnalysisDashboard 
              analysisData={analysisData} 
              fileName={fileName}
              onReset={handleReset} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <ChatUploadForm 
                onAnalysisComplete={handleAnalysisComplete} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </main>
        <footer className="py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Chatrospective. All rights reserved.</p>
          <p className="mt-1">Uncover the stories hidden in your conversations.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

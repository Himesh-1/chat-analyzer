import { MessageSquareText } from 'lucide-react';

export function ChatHeader() {
  return (
    <header className="py-8">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <MessageSquareText className="h-10 w-10 text-primary mr-3" />
        <h1 className="text-4xl font-bold text-primary-foreground">Chatrospective</h1>
      </div>
    </header>
  );
}

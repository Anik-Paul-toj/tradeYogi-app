"use client";

import {useState, useRef, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {analyzeStockSymbol} from '@/ai/flows/analyze-stock-symbol';
import {chat} from '@/ai/flows/chat-flow';
import {TradingAnalysisDisplay} from "@/components/trading-analysis-display";
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({message, isUser}: { message: string; isUser: boolean }) => (
  <div className={cn(
    "mb-2 rounded-md p-2",
    isUser ? "bg-primary text-primary-foreground ml-auto w-fit" : "bg-secondary text-secondary-foreground mr-auto w-fit"
  )}>
    {message}
  </div>
);

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis) {
      setMessages(prevMessages => [...prevMessages, {
        text: `Stock Analysis:`,
        isUser: false,
      }]);
    }
  }, [analysis]);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prevMessages => [...prevMessages, {text: input, isUser: true}]);

    try {
      // Basic check if the message looks like a stock symbol
      const stockSymbol = input.trim();
      if (/^[A-Z]+$/.test(stockSymbol) || stockSymbol.endsWith(".NS")) {
        setAnalysis(null); // Clear previous analysis

	if (stockSymbol.endsWith(".NS")) {
          setMessages(prevMessages => [...prevMessages, {
            text: "I am sorry, I cannot fulfill this request. I am unable to provide real-time stock market data or specific financial information about " + stockSymbol + ". You can find this information on financial websites such as Google Finance, Yahoo Finance, or the official website of the Bombay Stock Exchange (BSE).",
            isUser: false,
          }]);
	} else {

        // Simulate API call
        setMessages(prevMessages => [...prevMessages, {
          text: `Analyzing stock symbol: ${stockSymbol}`,
          isUser: false,
        }]);
        const analysis = await analyzeStockSymbol({symbol: stockSymbol});
        setAnalysis(analysis);
	}
      } else {
        // Use chat flow for general queries
        setMessages(prevMessages => [...prevMessages, {
          text: "I'm thinking...",
          isUser: false,
        }]);
        const chatResponse = await chat({query: input.trim()});
	console.log(chatResponse);
        setMessages(prevMessages => [...prevMessages, {
          text: chatResponse.response,
          isUser: false,
        }]);
      }
    } catch (error: any) {
      setMessages(prevMessages => [...prevMessages, {
        text: `Error: ${error.message}`,
        isUser: false,
      }]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-background py-4 text-center">
        <h1 className="text-3xl font-bold">Yogi's Tips</h1>
      </div>

      <Card className="flex-grow overflow-hidden">
        <CardContent className="flex flex-col h-full">
          <div className="overflow-y-auto flex-grow mb-2 p-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isUser={message.isUser} />
            ))}
            {analysis && (
              <div className="mr-auto w-fit">
                <TradingAnalysisDisplay analysis={analysis} />
              </div>
            )}
            <div ref={chatBoxRef} />
          </div>

          <div className="flex items-center p-4">
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g. AAPL) or ask a question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow mr-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

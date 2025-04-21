'use client';

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";

interface TradingAnalysis {
  symbol: string;
  market_analysis: string;
  technical_analysis: string;
  sentiment_analysis: string;
  recommendation: string;
  entry_points: number[];
  stop_loss: number;
  take_profit: number[];
  sources: string[];
  tools_used: string[];
  risk_level: string;
}

interface TradingAnalysisDisplayProps {
  analysis: TradingAnalysis;
}

export const TradingAnalysisDisplay: React.FC<TradingAnalysisDisplayProps> = ({analysis}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trading Analysis for {analysis.symbol}</CardTitle>
        <CardDescription>Comprehensive analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="market_analysis">
            <AccordionTrigger>Market Analysis</AccordionTrigger>
            <AccordionContent>{analysis.market_analysis}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="technical_analysis">
            <AccordionTrigger>Technical Analysis</AccordionTrigger>
            <AccordionContent>{analysis.technical_analysis}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="sentiment_analysis">
            <AccordionTrigger>Sentiment Analysis</AccordionTrigger>
            <AccordionContent>{analysis.sentiment_analysis}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="recommendation">
            <AccordionTrigger>Recommendation</AccordionTrigger>
            <AccordionContent>{analysis.recommendation}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="entry_exit">
            <AccordionTrigger>Entry/Exit Points &amp; Risk</AccordionTrigger>
            <AccordionContent>
              <div>
                <div>
                  <strong>Entry Points:</strong> {analysis.entry_points.join(", ")}
                </div>
                <div>
                  <strong>Stop Loss:</strong> {analysis.stop_loss}
                </div>
                <div>
                  <strong>Take Profit:</strong> {analysis.take_profit.join(", ")}
                </div>
                <div>
                  <strong>Risk Level:</strong> <Badge>{analysis.risk_level}</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sources">
            <AccordionTrigger>Sources</AccordionTrigger>
            <AccordionContent>
              <ul>
                {analysis.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source} target="_blank" rel="noopener noreferrer">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tools_used">
            <AccordionTrigger>Tools Used</AccordionTrigger>
            <AccordionContent>{analysis.tools_used.join(", ")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

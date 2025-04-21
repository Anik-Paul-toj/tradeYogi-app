'use server';

// The analyzeStockSymbol flow analyzes a given stock symbol and provides a comprehensive market analysis.
// It takes a stock symbol as input and returns a detailed analysis including market conditions, technical indicators,
// sentiment analysis, and trading recommendations.
// analyzeStockSymbol - A function that handles the plant diagnosis process.
// AnalyzeStockSymbolInput - The input type for the analyzeStockSymbol function.
// TradingAnalysis - The return type for the diagnosePlant function.

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getWebSearchResults} from '@/services/web-search';
import {getWikiSummary} from '@/services/wikipedia';

const AnalyzeStockSymbolInputSchema = z.object({
  symbol: z.string().describe('The stock symbol to analyze (e.g., AAPL, MSFT).'),
});

export type AnalyzeStockSymbolInput = z.infer<typeof AnalyzeStockSymbolInputSchema>;

const TradingAnalysisSchema = z.object({
  symbol: z.string().describe('The stock symbol being analyzed.'),
  market_analysis: z.string().describe('Analysis of current market conditions and price action.'),
  technical_analysis: z.string().describe('Evaluation of technical indicators (Moving averages, RSI, MACD, etc.).'),
  sentiment_analysis: z.string().describe('Assessment of market sentiment and news impact.'),
  recommendation: z.string().describe('Trading recommendations based on the analysis.'),
  entry_points: z.array(z.number()).describe('Specific entry points for trading.'),
  stop_loss: z.number().describe('Stop loss level for risk management.'),
  take_profit: z.array(z.number()).describe('Take profit levels for trading.'),
  sources: z.array(z.string()).describe('Sources used for the analysis (e.g., news articles, financial reports).'),
  tools_used: z.array(z.string()).describe('Tools used during the analysis (e.g., WebSearch, Wikipedia).'),
  risk_level: z.string().describe('The risk level associated with the recommendation (e.g. high, medium, low).'),
});

export type TradingAnalysis = z.infer<typeof TradingAnalysisSchema>;

export async function analyzeStockSymbol(input: AnalyzeStockSymbolInput): Promise<TradingAnalysis> {
  return analyzeStockSymbolFlow(input);
}

const webSearch = ai.defineTool({
  name: 'WebSearch',
  description: 'Search the web for current information, news, and market data. Use this for up-to-date information on stocks, cryptocurrencies, and market conditions.',
  inputSchema: z.object({
    query: z.string().describe('The search query.'),
  }),
  outputSchema: z.array(z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
  })),
},
async input => {
  return getWebSearchResults(input.query);
});

const wikipediaSearch = ai.defineTool({
  name: 'Wikipedia',
  description: 'Search Wikipedia for information about a topic. Useful for historical data, company information, and general knowledge.',
  inputSchema: z.object({
    query: z.string().describe('The search query.'),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
},
async input => {
  return getWikiSummary(input.query);
});

const analyzeStockSymbolPrompt = ai.definePrompt({
  name: 'analyzeStockSymbolPrompt',
  input: {
    schema: z.object({
      symbol: z.string().describe('The stock symbol to analyze.'),
    }),
  },
  output: {
    schema: TradingAnalysisSchema,
  },
  tools: [webSearch, wikipediaSearch],
  prompt: `You are an expert trading analyst specializing in comprehensive market analysis.

  Analyze the trading symbol {{symbol}} and return a detailed trading analysis with the following information:

  1. Analyze current market conditions and price action.
  2. Evaluate technical indicators (Moving averages, RSI, MACD, etc.).
  3. Assess market sentiment and news impact.
  4. Provide specific entry/exit points and risk management.
  5. Set clear stop loss and take profit levels.
  6. Determine the risk level associated with the recommendation (e.g. high, medium, low).

  Use the available tools to gather market data, news, and historical information.

  Make sure your response is in the following JSON format:
  {
    "symbol": "string",
    "market_analysis": "string",
    "technical_analysis": "string",
    "sentiment_analysis": "string",
    "recommendation": "string",
    "entry_points": [number],
    "stop_loss": number,
    "take_profit": [number],
    "sources": ["string"],
    "tools_used": ["WebSearch", "Wikipedia"],
    "risk_level": "string",
  }`,
});

const analyzeStockSymbolFlow = ai.defineFlow<
  typeof AnalyzeStockSymbolInputSchema,
  typeof TradingAnalysisSchema
>({
  name: 'analyzeStockSymbolFlow',
  inputSchema: AnalyzeStockSymbolInputSchema,
  outputSchema: TradingAnalysisSchema,
},
async input => {
  const {output} = await analyzeStockSymbolPrompt(input);
  return output!;
});

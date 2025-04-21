export const extractStockTickers = (text: string): string[] => {
  // Match stock tickers (1-5 uppercase letters)
  const tickerRegex = /\b[A-Z]{1,5}\b/g;
  const matches = text.match(tickerRegex) || [];
  
  // Filter out common words that might match the pattern
  const commonWords = new Set(['A', 'I', 'IN', 'ON', 'AT', 'TO', 'BY', 'FOR', 'THE', 'AND', 'OR', 'BUT']);
  
  return [...new Set(matches.filter(ticker => !commonWords.has(ticker)))];
}; 
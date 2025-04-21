const positiveWords = new Set([
    'up', 'rise', 'gain', 'surge', 'increase', 'positive', 'strong', 'growth',
    'profit', 'success', 'win', 'beat', 'exceed', 'outperform', 'bullish',
    'optimistic', 'improve', 'boost', 'recovery', 'record', 'high'
  ]);
  
  const negativeWords = new Set([
    'down', 'fall', 'drop', 'decline', 'decrease', 'negative', 'weak', 'loss',
    'miss', 'below', 'underperform', 'bearish', 'pessimistic', 'worse',
    'reduce', 'cut', 'downgrade', 'low', 'trouble', 'risk'
  ]);
  
  export const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
  
    words.forEach(word => {
      if (positiveWords.has(word)) positiveCount++;
      if (negativeWords.has(word)) negativeCount++;
    });
  
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };
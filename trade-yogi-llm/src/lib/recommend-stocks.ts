import {fetchStockData} from '@/services/yfinance';

const categoryStocks: {[key: string]: string[]} = {
  'Long-Term Investor': ['AAPL', 'MSFT', 'TCS.NS', 'INFY.NS', 'RELIANCE.NS'],
  'Swing Trader': ['SBIN.NS', 'HDFCBANK.NS', 'AXISBANK.NS', 'ITC.NS'],
  'Day Trader': ['ADANIENT.NS', 'TATAMOTORS.NS', 'VEDL.NS', 'YESBANK.NS'],
  'Experimental Trader': ['DOGE-USD', 'BTC-USD', 'MATIC-USD'],
  'Balanced Investor': ['NIFTYBEES.NS', 'ICICIBANK.NS', 'HCLTECH.NS'],
};

async function isStockUpwardTrending(ticker: string): Promise<boolean> {
  try {
    const df = await fetchStockData(ticker);
    if (!df || df.length === 0) {
      return false;
    }

    const ma20 = (index: number) => {
      if (index < 19) {
        return 0;
      }
      let sum = 0;
      for (let i = index - 19; i <= index; i++) {
        sum += df[i].Close;
      }
      return sum / 20;
    };

    const ma50 = (index: number) => {
      if (index < 49) {
        return 0;
      }
      let sum = 0;
      for (let i = index - 49; i <= index; i++) {
        sum += df[i].Close;
      }
      return sum / 50;
    };

    const latestMa20 = ma20(df.length - 1);
    const latestMa50 = ma50(df.length - 1);

    return latestMa20 > latestMa50;
  } catch (error) {
    console.error(`Error calculating moving averages for ${ticker}:`, error);
    return false;
  }
}

export async function recommendStocks(category: string): Promise<
  {
    ticker: string;
    status: string;
  }[]
> {
  const tickers = categoryStocks[category] || [];
  const results: {ticker: string; status: string}[] = [];

  for (const ticker of tickers) {
    try {
      const trending = await isStockUpwardTrending(ticker);
      const status = trending ? '⬆ Uptrend' : '⬇ Not Trending';
      results.push({ticker, status});
    } catch (error) {
      console.error(`Error processing ${ticker}:`, error);
      results.push({ticker, status: '⚠ Error fetching data'});
    }
  }
  return results;
}



/**
 * Represents stock data, including opening price, closing price, and volume.
 */
export interface StockData {
  /**
   * The opening price of the stock.
   */
  Open: number;
  /**
   * The closing price of the stock.
   */
  Close: number;
  /**
   * The trading volume of the stock.
   */
  Volume: number;
}

/**
 * Asynchronously fetches stock data for a given ticker symbol.
 *
 * @param ticker The ticker symbol of the stock to fetch data for.
 * @returns A promise that resolves to an array of StockData objects.
 */
export async function fetchStockData(ticker: string): Promise<StockData[]> {
  // TODO: Implement this by calling the yfinance API.
  // Replace with actual API call when available

  // Placeholder data
  const placeholderData = [
    {
      Open: 150.0,
      Close: 152.0,
      Volume: 1000000,
    },
    {
      Open: 152.0,
      Close: 155.0,
      Volume: 1200000,
    },
    {
      Open: 156.0,
      Close: 158.0,
      Volume: 1300000,
    },
    {
      Open: 158.0,
      Close: 157.0,
      Volume: 1100000,
    },
    {
      Open: 157.0,
      Close: 160.0,
      Volume: 1400000,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(placeholderData);
    }, 500); // Simulate network latency
  });
}

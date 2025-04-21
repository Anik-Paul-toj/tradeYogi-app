'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StockRecommendationProps {
  recommendations: {ticker: string; status: string}[];
}

export const StockRecommendation: React.FC<StockRecommendationProps> = ({
  recommendations,
}) => {
  const handleStockClick = (ticker: string) => {
    const encodedTicker = encodeURIComponent(ticker);
    window.location.href = `https://trade-yogi-chatbot.vercel.app/?prefill=${encodedTicker}`;
  };

  return (
    <div className="items-center justify-center">
      <h2 className="mb-4 text-xl font-semibold">Stock Recommendations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((recommendation) => (
            <TableRow key={recommendation.ticker}>
              <TableCell>
                <button
                  onClick={() => handleStockClick(recommendation.ticker)}
                  className="text-primary hover:underline"
                >
                  {recommendation.ticker}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

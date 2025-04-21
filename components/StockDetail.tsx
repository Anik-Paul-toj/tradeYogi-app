import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

interface StockDetailProps {
  symbol: string;
}

export default function StockDetail({ symbol }: StockDetailProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      // Fetch quote data
      const quoteResponse = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}`,
        {
          params: {
            token: 'd01ki19r01qile6051q0d01ki19r01qile6051qg'
          }
        }
      );

      // Fetch company profile
      const profileResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`,
        {
          params: {
            token: 'd01ki19r01qile6051q0d01ki19r01qile6051qg'
          }
        }
      );

      const quote = quoteResponse.data;
      const profile = profileResponse.data;

      setStockData({
        symbol: symbol,
        name: profile.name || symbol,
        price: quote.c,
        change: quote.c - quote.pc,
        changePercent: ((quote.c - quote.pc) / quote.pc) * 100,
        marketCap: profile.marketCapitalization || 0,
        volume: quote.t,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc
      });
    } catch (err) {
      setError('Failed to fetch stock data. Please try again later.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!stockData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? '#4CAF50' : '#F44336';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{stockData.symbol}</Text>
        <Text style={styles.name}>{stockData.name}</Text>
        <Text style={[styles.price, { color: changeColor }]}>
          ${stockData.price.toFixed(2)}
        </Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Market Cap</Text>
          <Text style={styles.detailValue}>
            ${(stockData.marketCap / 1000000000).toFixed(2)}B
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Volume</Text>
          <Text style={styles.detailValue}>
            {stockData.volume.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>High</Text>
          <Text style={styles.detailValue}>
            ${stockData.high.toFixed(2)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Low</Text>
          <Text style={styles.detailValue}>
            ${stockData.low.toFixed(2)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Open</Text>
          <Text style={styles.detailValue}>
            ${stockData.open.toFixed(2)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Previous Close</Text>
          <Text style={styles.detailValue}>
            ${stockData.previousClose.toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  change: {
    fontSize: 16,
    marginTop: 8,
  },
  detailsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 
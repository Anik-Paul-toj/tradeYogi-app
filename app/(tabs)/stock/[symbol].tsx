import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { NseIndia } from "stock-nse-india";
import moment from 'moment';

interface StockDetail {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  yearHigh: number;
  yearLow: number;
}

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams();
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockDetails();
  }, [symbol]);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const nseIndia = new NseIndia();
      const stockData = await nseIndia.getEquityDetails(symbol as string);
      
      if (stockData) {
        setStock({
          symbol: stockData.info?.symbol || symbol as string,
          companyName: stockData.info?.companyName || symbol as string,
          lastPrice: stockData.priceInfo?.lastPrice || 0,
          change: stockData.priceInfo?.change || 0,
          pChange: stockData.priceInfo?.pChange || 0,
          dayHigh: stockData.priceInfo?.intraDayHighLow?.max || 0,
          dayLow: stockData.priceInfo?.intraDayHighLow?.min || 0,
          open: stockData.priceInfo?.open || 0,
          previousClose: stockData.priceInfo?.previousClose || 0,
          yearHigh: stockData.priceInfo?.weekHighLow?.max || 0,
          yearLow: stockData.priceInfo?.weekHighLow?.min || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
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

  if (!stock) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stock details</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.symbol}>{stock.symbol}</Text>
            <Text style={styles.companyName}>{stock.companyName}</Text>
            <Text style={styles.price}>₹{stock.lastPrice.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</Text>
            <Text style={[
              styles.change,
              { color: stock.pChange >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {stock.pChange >= 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
              ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Range</Text>
            <Text style={styles.description}>The highest and lowest prices the stock has traded at today.</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>High</Text>
                <Text style={styles.value}>₹{stock.dayHigh.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Low</Text>
                <Text style={styles.value}>₹{stock.dayLow.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Key Metrics</Text>
            <Text style={styles.description}>Important price points that help understand the stock's performance.</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Open</Text>
                <Text style={styles.value}>₹{stock.open.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Previous Close</Text>
                <Text style={styles.value}>₹{stock.previousClose.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>52 Week Range</Text>
            <Text style={styles.description}>The highest and lowest prices the stock has traded at in the last year.</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>High</Text>
                <Text style={styles.value}>₹{stock.yearHigh.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Low</Text>
                <Text style={styles.value}>₹{stock.yearLow.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor:'gray',
    borderWidth:1
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  change: {
    fontSize: 16,
    color: '#000000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
}); 
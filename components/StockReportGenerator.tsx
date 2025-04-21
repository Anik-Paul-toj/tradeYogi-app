import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  rsi: number;
  macd: number;
  timestamp: string;
}

const StockReportGenerator: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('https://api.example.com/stock-data');
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (stockData.length === 0) return null;

    const latestData = stockData[stockData.length - 1];
    const priceData = stockData.map(data => data.price);
    const labels = stockData.map(data => new Date(data.timestamp).toLocaleDateString());

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Stock Analysis Report</Text>
          <Text style={styles.subtitle}>{latestData.symbol}</Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels,
              datasets: [{ data: priceData }],
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Current Price:</Text>
            <Text style={styles.metricValue}>${latestData.price.toFixed(2)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>24h Change:</Text>
            <Text style={[styles.metricValue, { color: latestData.change >= 0 ? '#34C759' : '#FF3B30' }]}>
              {latestData.change >= 0 ? '+' : ''}{latestData.change.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Volume:</Text>
            <Text style={styles.metricValue}>{latestData.volume.toLocaleString()}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>RSI:</Text>
            <Text style={styles.metricValue}>{latestData.rsi.toFixed(2)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>MACD:</Text>
            <Text style={styles.metricValue}>{latestData.macd.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.analysisContainer}>
          <Text style={styles.sectionTitle}>Technical Analysis</Text>
          <Text style={styles.analysisText}>
            {generateAnalysisText(latestData)}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const generateAnalysisText = (data: StockData) => {
    let analysis = '';
    
    // RSI Analysis
    if (data.rsi > 70) {
      analysis += 'The RSI indicates overbought conditions. ';
    } else if (data.rsi < 30) {
      analysis += 'The RSI indicates oversold conditions. ';
    }

    // MACD Analysis
    if (data.macd > 0) {
      analysis += 'The MACD shows bullish momentum. ';
    } else {
      analysis += 'The MACD shows bearish momentum. ';
    }

    // Price Change Analysis
    if (data.change > 0) {
      analysis += 'The stock is showing positive momentum. ';
    } else {
      analysis += 'The stock is showing negative momentum. ';
    }

    return analysis || 'No significant technical signals detected.';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading report...</Text>
      </View>
    );
  }

  return generateReport();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
    marginVertical: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  analysisContainer: {
    marginVertical: 20,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default StockReportGenerator; 
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NseIndia } from "stock-nse-india";
import { STOCK_TICKERS } from '../../constants/stocks';

interface PredictionResponse {
  ticker: string;
  investment_amount: number;
  investment_days: number;
  predicted_return_percent: number;
  predicted_value: number;
  risk_level: string;
  data_points_used: number;
  data_source: string;
  company_name?: string;
}

export default function Reports() {
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDays, setInvestmentDays] = useState('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTickerList, setShowTickerList] = useState(false);

  const filteredTickers = STOCK_TICKERS.filter(ticker =>
    ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTickerSelect = (selectedTicker: string) => {
    setTicker(selectedTicker);
    setSearchQuery(selectedTicker + '.NS');
    setShowTickerList(false);
  };

  const handlePredict = async () => {
    if (!ticker || !investmentAmount || !investmentDays) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://stock-predict-nib1.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: ticker,
          investment_amount: parseFloat(investmentAmount),
          investment_days: parseInt(investmentDays)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      
      // Fetch company details after getting prediction
      try {
        const nseIndia = new NseIndia();
        const details = await nseIndia.getEquityDetails(ticker);
        setPrediction({
          ...data,
          company_name: details.info.companyName
        });
      } catch (error) {
        console.error('Error fetching company details:', error);
        setPrediction({
          ...data,
          company_name: 'N/A'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E2A3B', '#2C3E50']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>AI Based Stock Report</Text>
      </LinearGradient>
      <ScrollView style={styles.content}>
        {!prediction ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stock Ticker</Text>
              <TextInput
                style={styles.input}
                placeholder="Search stock ticker..."
                value={searchQuery}
                onChangeText={(text) => {
                  const cleanText = text.replace('.NS', '');
                  setSearchQuery(text);
                  setTicker(cleanText);
                  setShowTickerList(true);
                }}
                onFocus={() => setShowTickerList(true)}
              />
              {showTickerList && (
                <View style={styles.tickerList}>
                  {filteredTickers.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.tickerItem}
                      onPress={() => handleTickerSelect(item)}
                    >
                      <Text style={styles.tickerText}>{item}.NS</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Investment Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={investmentAmount}
                onChangeText={setInvestmentAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Investment Period (Days)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number of days"
                value={investmentDays}
                onChangeText={setInvestmentDays}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.predictButton}
              onPress={handlePredict}
              disabled={loading}
            >
              <Text style={styles.predictButtonText}>
                {loading ? 'Predicting...' : 'Get Prediction'}
              </Text>
            </TouchableOpacity>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠ Disclaimer: Stock market predictions are not 100% accurate and should not be considered as financial advice. Past performance is not indicative of future results. Please conduct your own research and invest at your own risk.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionTitle}>Prediction Results</Text>
            
            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Stock</Text>
              <Text style={styles.predictionValue}>{prediction?.ticker || 'N/A'}</Text>
              <Text style={styles.companyName}>{prediction?.company_name || 'N/A'}</Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Investment Amount</Text>
              <Text style={styles.predictionValue}>
                ₹{prediction?.investment_amount ? 
                  prediction.investment_amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) 
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Investment Period</Text>
              <Text style={styles.predictionValue}>{prediction?.investment_days || 'N/A'} days</Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Predicted Return</Text>
              <Text style={[
                styles.predictionValue,
                { color: prediction?.predicted_return_percent >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {prediction?.predicted_return_percent !== undefined ? 
                  (prediction.predicted_return_percent >= 0 ? '+' : '') + 
                  prediction.predicted_return_percent.toFixed(2) + '%' 
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Predicted Value</Text>
              <Text style={styles.predictionValue}>
                ₹{prediction?.predicted_value ? 
                  prediction.predicted_value.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) 
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Risk Level</Text>
              <Text style={[
                styles.predictionValue,
                { 
                  color: prediction?.risk_level?.includes('Low') ? '#34C759' : 
                         prediction?.risk_level?.includes('Medium') ? '#FF9500' : '#FF3B30'
                }
              ]}>
                {prediction?.risk_level || 'N/A'}
              </Text>
            </View>

            <View style={styles.predictionCard}>
              <Text style={styles.predictionLabel}>Accuracy Percentage</Text>
              <Text style={styles.predictionValue}>
                {prediction?.data_points_used ? 
                  (() => {
                    const dataPoints = prediction.data_points_used;
                    let accuracyPercentage = 0;
                    
                    if (dataPoints <= 100) {
                      accuracyPercentage = (dataPoints / 100) * 100;
                    } else if (dataPoints > 100 && dataPoints <= 150) {
                      accuracyPercentage = (dataPoints / 150) * 100;
                    } else if (dataPoints > 150 && dataPoints <= 200) {
                      accuracyPercentage = (dataPoints / 200) * 100;
                    } else {
                      accuracyPercentage = 100; // Cap at 100% for data points > 200
                    }
                    
                    return accuracyPercentage.toFixed(2) + '%';
                  })() 
                  : 'N/A'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPrediction(null)}
            >
              <Text style={styles.backButtonText}>Back to Form</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  tickerList: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 1,
    // overflow: 'hidden', // <-- Remove this
  },
  tickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    // height: 40, // <-- Remove this so content can size itself naturally
  },
  tickerText: {
    fontSize: 12,
    color: '#000000',
  },
  predictButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  predictButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionContainer: {
    flex: 1,
    padding: 16,
  },
  predictionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  predictionLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  backButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginTop: 100,
  },
  warningText: {
    color: '#D32F2F',
    fontSize: 12,
    lineHeight: 16,
  },
});
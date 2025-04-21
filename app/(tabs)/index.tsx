import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NseIndia } from 'stock-nse-india';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

import {Easing } from 'react-native';


interface Stock {
  symbol: string;
  lastPrice: number;
  change: number;
  pChange: number;
  companyName: string;
}

interface NiftyData {
  symbol: string;
  lastPrice: number;
  change: number;
  pChange: number;
}

const NiftyTicker = () => {
  const [niftyData, setNiftyData] = useState<NiftyData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollX = new Animated.Value(0);
  const ANIMATION_DURATION = 80000; // 80 seconds for one complete scroll
  const animationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    fetchNiftyData();
    const interval = setInterval(fetchNiftyData, 60000);
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const fetchNiftyData = async () => {
    try {
      const nseIndia = new NseIndia();
      const response = await nseIndia.getEquityStockIndices("NIFTY 50");
      
      if (response && response.data) {
        const data: NiftyData[] = response.data.map((stock: any) => ({
          symbol: stock.symbol,
          lastPrice: stock.lastPrice,
          change: stock.change,
          pChange: stock.pChange
        }));
        setNiftyData(data);
      }
    } catch (error) {
      console.error('Error fetching Nifty data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (niftyData.length > 0) {
      const totalWidth = niftyData.length * 200;
      
      // Stop any existing animation
      if (animationRef.current) {
        animationRef.current.stop();
      }

      // Reset the scroll position
      scrollX.setValue(0);

      // Create new animation
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -totalWidth,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      );

      // Start the animation
      animationRef.current.start();
    }
  }, [niftyData]);

  if (loading) {
    return (
      <View style={styles.tickerContainer}>
        <Text style={styles.tickerText}>Loading Nifty data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.tickerContainer}>
      <Animated.View
        style={[styles.tickerContent, { transform: [{ translateX: scrollX }] }]}
      >
        {[...niftyData, ...niftyData].map((stock, idx) => (
          <View key={idx} style={styles.tickerItem}>
            <Text style={styles.tickerSymbol}>{stock.symbol}</Text>
            <Text style={styles.tickerPrice}>
              ₹{stock.lastPrice.toLocaleString('en-IN')}
            </Text>
            <Text
              style={[
                styles.tickerChange,
                { color: stock.pChange >= 0 ? '#34C759' : '#FF3B30' },
              ]}
            >
              {stock.pChange >= 0 ? '+' : ''}
              {stock.pChange.toFixed(2)}%
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default function HomeScreen() {
  const [portfolioBalance, setPortfolioBalance] = useState('0');
  const [topGainers, setTopGainers] = useState<Stock[]>([]);
  const [topLosers, setTopLosers] = useState<Stock[]>([]);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  const loadBalance = async () => {
    try {
      const stored = await AsyncStorage.getItem('portfolioBalance');
      if (stored) setPortfolioBalance(stored);
    } catch (err) {
      console.error('Portfolio load error:', err);
    }
  };

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedImage = await AsyncStorage.getItem('profileImage');
      
      if (storedName) setUserName(storedName);
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const nseIndia = new NseIndia();
      const response = await nseIndia.getEquityStockIndices('NIFTY 50');

      if (response?.data) {
        const stocks: Stock[] = response.data.map((stock: any) => ({
          symbol: stock.symbol,
          lastPrice: stock.lastPrice,
          change: stock.change,
          pChange: stock.pChange,
          companyName: stock.meta?.companyName || stock.symbol,
        }));

        const sorted = stocks.sort((a, b) => b.pChange - a.pChange);
        setTopGainers(sorted.slice(0, 10));
        setTopLosers(sorted.slice(-10).reverse());
      }
    } catch (err) {
      console.error('Stocks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
    fetchStocks();
    loadUserData();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderStockItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity onPress={() => router.push(`/stock/${item.symbol}`)}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.stockItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{item.symbol}</Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.companyName}
          </Text>
          <Text style={styles.stockPrice}>
            ₹
            {item.lastPrice.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.stockChange}>
          <Text
            style={[
              styles.changeText,
              { color: item.pChange >= 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            {item.pChange >= 0 ? '+' : ''}
            {item.pChange.toFixed(2)}%
          </Text>
          <Text
            style={[
              styles.changeAmount,
              { color: item.pChange >= 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            {item.change >= 0 ? '+' : ''}
            {item.change.toFixed(2)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.customHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.profileImage} 
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={44}
                  color="#1E2A3B"
                  style={styles.profileIcon}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.greetingText}>
              {userName ? `Hey ${userName.split(' ')[0]}` : 'Hey There'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dematButton}
            onPress={() => router.push('/demat')}
          >
            <Text style={styles.dematButtonText}>Open Demat Account</Text>
          </TouchableOpacity>
        </View>

        <NiftyTicker />

        <LinearGradient
          colors={['#1E2A3B', '#2C3E50']}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.balanceLabel}>Portfolio Balance</Text>
          <Text style={styles.balanceAmount}>
            ₹
            {parseFloat(portfolioBalance).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </LinearGradient>

        <View style={styles.stocksSection}>
          <View style={styles.tabContainer}>
            {(['gainers', 'losers'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {`Top ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={activeTab === 'gainers' ? topGainers : topLosers}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.symbol}
            contentContainerStyle={styles.stocksList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      {/* Floating Gift Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          zIndex: 1000,
          backgroundColor: '#007AFF',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#007AFF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Ionicons name="gift" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal with Embedded Website */}
      <Modal
        animationType="slide"
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: '#007AFF',
              alignSelf: 'flex-end',
              margin: 10,
              borderRadius: 8,
              zIndex: 100,
            }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>

          <WebView
            source={{ uri: 'https://trade-yogi-llm.vercel.app' }}
            style={{ flex: 1 }}
            startInLoadingState
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2A3B',
  },
  dematButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  dematButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  headerContent: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stocksSection: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderColor:'#007AFF',
    borderWidth:1
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  stocksList: {
    paddingBottom: 16,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderColor:'gray',
    borderWidth:1,
  },
  stockInfo: {
    flex: 1,
    marginRight: 8,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  companyName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stockPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight:'bold'
  },
  stockChange: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  changeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeAmount: {
    fontSize: 14,
    marginTop: 4,
  },
  tickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  tickerContent: {
    flexDirection: 'row',
    width: '100%',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
    paddingHorizontal: 12,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  tickerSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
    minWidth: 60,
  },
  tickerPrice: {
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
    minWidth: 80,
  },
  tickerChange: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 60,
  },
  tickerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 12,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
});

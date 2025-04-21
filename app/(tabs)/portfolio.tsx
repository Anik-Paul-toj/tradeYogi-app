import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STOCK_TICKERS } from '../../constants/stocks';
import { NseIndia } from "stock-nse-india";

interface Transaction {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: Date;
}

interface Stock {
  symbol: string;
  companyName: string;
  lastPrice: number;
  quantity: number;
  totalValue: number;
  averagePrice: number;
  realizedProfit: number;
}

interface NiftyData {
  symbol: string;
  lastPrice: number;
  change: number;
  pChange: number;
}

const CurrentHoldings = ({ stocks, handleTrade }: { stocks: Stock[], handleTrade: (stock: Stock, type: 'buy' | 'sell') => void }) => (
  <View style={styles.tabContent}>
    {stocks.length === 0 ? (
      <View style={styles.emptyState}>
        <MaterialIcons name="inventory" size={64} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>Your portfolio is empty</Text>
        <Text style={styles.emptyStateSubtext}>Add stocks to start tracking your investments</Text>
      </View>
    ) : (
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <View style={styles.stockCard}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockSymbol}>{item.symbol}</Text>
              <Text style={styles.stockName}>{item.companyName}</Text>
            </View>
            <View style={styles.stockDetails}>
              <View style={styles.priceContainer}>
                <Text style={styles.stockPrice}>₹{item.lastPrice.toLocaleString('en-IN')}</Text>
              </View>
              <Text style={styles.stockQuantity}>Qty: {item.quantity}</Text>
              <Text style={styles.stockValue}>Total: ₹{item.totalValue.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.buyButton]}
                onPress={() => handleTrade(item, 'buy')}
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.sellButton]}
                onPress={() => handleTrade(item, 'sell')}
              >
                <MaterialIcons name="remove" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    )}
  </View>
);

const TransactionHistory = ({ transactions }: { transactions: Transaction[] }) => (
  <View style={styles.tabContent}>
    {transactions.length === 0 ? (
      <View style={styles.emptyState}>
        <MaterialIcons name="history" size={64} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>No transactions yet</Text>
        <Text style={styles.emptyStateSubtext}>Your buy and sell history will appear here</Text>
      </View>
    ) : (
      <FlatList
        data={transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        keyExtractor={(item, index) => `${item.symbol}-${item.type}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionSymbol}>{item.symbol}</Text>
              <Text style={[
                styles.transactionType,
                item.type === 'buy' ? styles.buyType : styles.sellType
              ]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.transactionPrice}>Price: ₹{item.price.toLocaleString('en-IN')}</Text>
              <Text style={styles.transactionDate}>
                {new Date(item.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        )}
      />
    )}
  </View>
);

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
        style={[
          styles.tickerContent,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        {[...niftyData, ...niftyData].map((stock, index) => (
          <View key={index} style={styles.tickerItem}>
            <Text style={styles.tickerSymbol}>{stock.symbol}</Text>
            <Text style={styles.tickerPrice}>₹{stock.lastPrice.toLocaleString('en-IN')}</Text>
            <Text style={[
              styles.tickerChange,
              { color: stock.pChange >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {stock.pChange >= 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

type TabType = 'holdings' | 'history';

export default function PortfolioScreen() {
  const [balance, setBalance] = useState<string>('0');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [price, setPrice] = useState('');
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState('1');
  const [tradePrice, setTradePrice] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('holdings');

  useEffect(() => {
    loadPortfolio();
    loadTransactions();
  }, []);

  const loadPortfolio = async () => {
    try {
      const savedPortfolio = await AsyncStorage.getItem('portfolio');
      if (savedPortfolio) {
        setStocks(JSON.parse(savedPortfolio));
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const savePortfolio = async (newStocks: Stock[]) => {
    try {
      await AsyncStorage.setItem('portfolio', JSON.stringify(newStocks));
      setStocks(newStocks);
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const handleAddStock = async (symbol: string) => {
    try {
      const nseIndia = new NseIndia();
      const stockData = await nseIndia.getEquityDetails(symbol);
      
      if (stockData) {
        setSelectedStock({
          symbol: stockData.info?.symbol || symbol,
          companyName: stockData.info?.companyName || symbol,
          lastPrice: stockData.priceInfo?.lastPrice || 0,
          quantity: 0,
          totalValue: 0,
          averagePrice: 0,
          realizedProfit: 0
        });
        setQuantity('1');
        setCompanyName(stockData.info?.companyName || symbol);
        setPrice(stockData.priceInfo?.lastPrice?.toString() || '0');
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  const handleSaveStock = () => {
    if (selectedStock && quantity && companyName && price) {
      const newStock = {
        ...selectedStock,
        companyName: companyName,
        lastPrice: parseFloat(price),
        quantity: parseInt(quantity),
        totalValue: parseFloat(price) * parseInt(quantity),
        averagePrice: parseFloat(price),
        realizedProfit: 0
      };
      
      const newStocks = [...stocks, newStock];
      savePortfolio(newStocks);

      // Add transaction record
      const newTransaction: Transaction = {
        symbol: selectedStock.symbol,
        type: 'buy',
        quantity: parseInt(quantity),
        price: parseFloat(price),
        date: new Date()
      };
      saveTransactions([...transactions, newTransaction]);

      setIsAddModalVisible(false);
      setSelectedStock(null);
      setQuantity('');
      setCompanyName('');
      setPrice('');
    }
  };

  const handleTrade = async (stock: Stock, type: 'buy' | 'sell') => {
    try {
      const nseIndia = new NseIndia();
      const stockData = await nseIndia.getEquityDetails(stock.symbol);
      
      if (stockData) {
        setSelectedStock(stock);
        setTradeType(type);
        setTradePrice(stockData.priceInfo?.lastPrice?.toString() || stock.lastPrice.toString());
        setIsTradeModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  const handleTradeSubmit = () => {
    if (selectedStock && tradeQuantity && tradePrice) {
      const quantity = parseInt(tradeQuantity);
      const price = parseFloat(tradePrice);
      
      if (tradeType === 'buy') {
        const updatedStocks = stocks.map(s => {
          if (s.symbol === selectedStock.symbol) {
            const newQuantity = s.quantity + quantity;
            return {
              ...s,
              quantity: newQuantity,
              lastPrice: price,
              totalValue: price * newQuantity
            };
          }
          return s;
        });
        savePortfolio(updatedStocks);

        // Add buy transaction
        const newTransaction: Transaction = {
          symbol: selectedStock.symbol,
          type: 'buy',
          quantity: quantity,
          price: price,
          date: new Date()
        };
        saveTransactions([...transactions, newTransaction]);
      } else {
        if (selectedStock.quantity < quantity) {
          alert('Cannot sell more than you own');
          return;
        }
        const newQuantity = selectedStock.quantity - quantity;
        
        if (newQuantity === 0) {
          const updatedStocks = stocks.filter(s => s.symbol !== selectedStock.symbol);
          savePortfolio(updatedStocks);
        } else {
          const updatedStocks = stocks.map(s => {
            if (s.symbol === selectedStock.symbol) {
              return {
                ...s,
                quantity: newQuantity,
                lastPrice: price,
                totalValue: price * newQuantity
              };
            }
            return s;
          });
          savePortfolio(updatedStocks);
        }

        // Add sell transaction
        const newTransaction: Transaction = {
          symbol: selectedStock.symbol,
          type: 'sell',
          quantity: quantity,
          price: price,
          date: new Date()
        };
        saveTransactions([...transactions, newTransaction]);
      }
      
      setIsTradeModalVisible(false);
      setTradeQuantity('1');
      setTradePrice('');
    }
  };

  const filteredTickers = STOCK_TICKERS.filter(ticker =>
    ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculatePortfolioSummary = () => {
    let totalValue = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    // Calculate current portfolio value
    stocks.forEach(stock => {
      totalValue += stock.totalValue;
    });

    // Calculate profit/loss from transactions
    const stockTransactions = new Map<string, Transaction[]>();
    
    // Group transactions by symbol
    transactions.forEach(transaction => {
      if (!stockTransactions.has(transaction.symbol)) {
        stockTransactions.set(transaction.symbol, []);
      }
      stockTransactions.get(transaction.symbol)?.push(transaction);
    });

    // Calculate profit/loss for each stock
    stockTransactions.forEach((stockTxs, symbol) => {
      let remainingQuantity = 0;
      let buyTransactions: Transaction[] = [];

      stockTxs.forEach(tx => {
        if (tx.type === 'buy') {
          remainingQuantity += tx.quantity;
          buyTransactions.push(tx);
        } else {
          // For sell transactions, match with oldest buy transactions first (FIFO)
          let sellQuantity = tx.quantity;
          while (sellQuantity > 0 && buyTransactions.length > 0) {
            const buyTx = buyTransactions[0];
            const matchedQuantity = Math.min(sellQuantity, buyTx.quantity);
            
            const profitLoss = (tx.price - buyTx.price) * matchedQuantity;
            if (profitLoss > 0) {
              totalProfit += profitLoss;
            } else {
              totalLoss += Math.abs(profitLoss);
            }

            buyTx.quantity -= matchedQuantity;
            sellQuantity -= matchedQuantity;
            
            if (buyTx.quantity === 0) {
              buyTransactions.shift();
            }
          }
        }
      });
    });

    return {
      totalValue,
      totalProfit,
      totalLoss
    };
  };

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    let truncated = '';
    let suffix = '';

    if (absAmount >= 10000000) { // Crores
      truncated = (absAmount / 10000000).toFixed(2);
      suffix = 'Cr';
    } else if (absAmount >= 100000) { // Lakhs
      truncated = (absAmount / 100000).toFixed(2);
      suffix = 'L';
    } else if (absAmount >= 1000) { // Thousands
      truncated = (absAmount / 1000).toFixed(2);
      suffix = 'K';
    } else {
      truncated = absAmount.toFixed(2);
    }

    return {
      truncated: `${amount < 0 ? '-' : ''}₹${truncated}${suffix}`,
      exact: `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    };
  };

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient
        colors={['#007AFF', '#0051A8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>Manage your investments</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <NiftyTicker />
        
        <View style={styles.dashboard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dashboardScrollContent}
          >
            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardLabel}>Net Balance</Text>
              <Text style={styles.dashboardValue}>
                {formatAmount(calculatePortfolioSummary().totalValue).truncated}
              </Text>
              <Text style={styles.exactValue}>
                {formatAmount(calculatePortfolioSummary().totalValue).exact}
              </Text>
            </View>
            <View style={[styles.dashboardCard, styles.profitCard]}>
              <Text style={styles.dashboardLabel}>Profit</Text>
              <Text style={[styles.dashboardValue, styles.profitValue]}>
                {formatAmount(calculatePortfolioSummary().totalProfit).truncated}
              </Text>
              <Text style={[styles.exactValue, styles.profitValue]}>
                {formatAmount(calculatePortfolioSummary().totalProfit).exact}
              </Text>
            </View>
            <View style={[styles.dashboardCard, styles.lossCard]}>
              <Text style={styles.dashboardLabel}>Loss</Text>
              <Text style={[styles.dashboardValue, styles.lossValue]}>
                {formatAmount(calculatePortfolioSummary().totalLoss).truncated}
              </Text>
              <Text style={[styles.exactValue, styles.lossValue]}>
                {formatAmount(calculatePortfolioSummary().totalLoss).exact}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'holdings' && styles.activeTab]}
            onPress={() => setActiveTab('holdings')}
          >
            <Text style={[styles.tabText, activeTab === 'holdings' && styles.activeTabText]}>
              Current Holdings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Transaction History
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'holdings' ? (
          <CurrentHoldings stocks={stocks} handleTrade={handleTrade} />
        ) : (
          <TransactionHistory transactions={transactions} />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsAddModalVisible(true);
            setSelectedStock(null);
            setSearchQuery('');
          }}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Stock</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Stock</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsAddModalVisible(false);
                  setSelectedStock(null);
                  setSearchQuery('');
                  setQuantity('');
                  setCompanyName('');
                  setPrice('');
                }}
              >
                <MaterialIcons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            {!selectedStock ? (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search stock ticker..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <FlatList
                  data={filteredTickers}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.tickerListItem}
                      onPress={() => handleAddStock(item)}
                    >
                      <Text style={styles.tickerText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : (
              <>
                <View style={styles.stockInfo}>
                  <Text style={styles.stockSymbol}>{selectedStock.symbol}</Text>
                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Enter company name"
                  />
                  <Text style={styles.label}>Current Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Enter current price"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.quantityInput}
                  placeholder="Enter quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setSelectedStock(null);
                      setQuantity('');
                      setCompanyName('');
                      setPrice('');
                    }}
                  >
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveStock}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isTradeModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tradeType === 'buy' ? 'Buy Stock' : 'Sell Stock'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsTradeModalVisible(false);
                  setTradeQuantity('1');
                  setTradePrice('');
                }}
              >
                <MaterialIcons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {selectedStock && (
              <>
                <View style={styles.stockInfo}>
                  <Text style={styles.stockSymbol}>{selectedStock.symbol}</Text>
                  <Text style={styles.stockName}>{selectedStock.companyName}</Text>
                </View>

                <Text style={styles.label}>Current Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={tradePrice}
                  onChangeText={setTradePrice}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={tradeQuantity}
                  onChangeText={setTradeQuantity}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setIsTradeModalVisible(false);
                      setTradeQuantity('1');
                      setTradePrice('');
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, tradeType === 'buy' ? styles.buyButton : styles.sellButton]}
                    onPress={handleTradeSubmit}
                  >
                    <Text style={styles.buttonText}>{tradeType === 'buy' ? 'Buy' : 'Sell'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  stockInfo: {
    marginBottom: 8,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  stockName: {
    fontSize: 14,
    color: '#666666',
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  stockQuantity: {
    fontSize: 14,
    color: '#666666',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tickerListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tickerText: {
    fontSize: 16,
    color: '#000000',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editPriceButton: {
    marginLeft: 8,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buyButton: {
    backgroundColor: '#34C759',
  },
  sellButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    marginBottom: 4,
  },
  closeButton: {
    padding: 4,
  },
  dashboard: {
    marginBottom: 16,
  },
  dashboardScrollContent: {

  },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    width:325,
    height: 150,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  profitCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34C759',
  },
  lossCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  dashboardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dashboardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  exactValue: {
    fontSize: 12,
    color: '#666666',
  },
  profitValue: {
    color: '#2E7D32',
  },
  lossValue: {
    color: '#C62828',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderColor: '#007AFF',
    borderWidth: 1,
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
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buyType: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  sellType: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionQuantity: {
    fontSize: 14,
    color: '#666666',
  },
  transactionPrice: {
    fontSize: 14,
    color: '#666666',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
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
}); 
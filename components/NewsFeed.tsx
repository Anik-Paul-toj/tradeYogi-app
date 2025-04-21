import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { extractStockTickers } from '../utils/stockUtils';
import { analyzeSentiment } from '../utils/sentimentUtils';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
  tickers?: string[];
  sentiment: string;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        'https://newsapi.org/v2/top-headlines',
        {
          params: {
            country: 'us',
            category: 'business',
            apiKey: '875ead6d2e2a4000b1475c59b1708e2b'
          }
        }
      );

      // Extract tickers and analyze sentiment for each news item
      const newsWithTickers = response.data.articles.map((item: any) => {
        const tickers = extractStockTickers(`${item.title} ${item.description} ${item.content || ''}`);
        const sentiment = analyzeSentiment(`${item.title} ${item.description} ${item.content || ''}`);
        return {
          ...item,
          tickers,
          sentiment
        };
      });

      setNews(newsWithTickers);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {news.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.newsCard}
          onPress={() => {
            router.push({
              pathname: '/news/[id]',
              params: {
                id: index.toString(),
                title: item.title,
                description: item.description,
                url: item.url,
                urlToImage: item.urlToImage,
                publishedAt: item.publishedAt,
                sourceName: item.source.name,
                content: item.content || ''
              }
            });
          }}
        >
          {item.urlToImage && (
            <Image
              source={{ uri: item.urlToImage }}
              style={styles.newsImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDescription} numberOfLines={3}>
              {item.description}
            </Text>
            {item.tickers && item.tickers.length > 0 && (
              <View style={styles.tickersContainer}>
                {item.tickers.map((ticker, tickerIndex) => (
                  <TouchableOpacity
                    key={tickerIndex}
                    style={[
                      styles.tickerButton,
                      {
                        backgroundColor: item.sentiment === 'positive' 
                          ? '#E8F5E9' 
                          : item.sentiment === 'negative' 
                            ? '#FFEBEE' 
                            : '#E3F2FD'
                      }
                    ]}
                    onPress={() => {
                      router.push({
                        pathname: '/(tabs)/stock/[symbol]',
                        params: { symbol: ticker }
                      });
                    }}
                  >
                    <Text style={[
                      styles.tickerText,
                      {
                        color: item.sentiment === 'positive' 
                          ? '#4CAF50' 
                          : item.sentiment === 'negative' 
                            ? '#F44336' 
                            : '#1976D2'
                      }
                    ]}>
                      {ticker}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.newsFooter}>
              <Text style={styles.newsSource}>{item.source.name}</Text>
              <Text style={styles.newsDate}>
                {formatDate(item.publishedAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  tickersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tickerButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tickerText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NewsFeed; 
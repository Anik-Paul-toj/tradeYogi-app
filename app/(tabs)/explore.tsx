import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import NewsFeed from '../../components/NewsFeed';

export default function ExploreScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0); // Add a key state to force NewsFeed remount

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Force NewsFeed to remount by changing its key
    setKey(prevKey => prevKey + 1);
    setRefreshing(false);
  }, []);

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
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover market insights</Text>
        </View>
      </LinearGradient>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            title="Pull to refresh"
            titleColor="#666"
          />
        }
      >
        <NewsFeed key={key} />
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
  },
});

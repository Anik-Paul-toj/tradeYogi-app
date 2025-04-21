import React, { useRef, useState } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function Chat() {
  const webViewRef = useRef<WebView>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleRefresh();
    // Simulate a delay to show the refresh indicator
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://trade-yogi-chatbot.vercel.app' }}
          style={styles.webview}
          startInLoadingState
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

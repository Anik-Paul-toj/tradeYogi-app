import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

export default function DematScreen() {
  const router = useRouter();

  // Function to open URLs
  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert(`Can't open this URL: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E2A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Open Demat Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Box 1 - Groww */}
        <TouchableOpacity style={styles.box} onPress={() => openURL('https://groww.in')}>
          <Image
            source={require('../assets/groww.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Box 2 - Upstox */}
        <TouchableOpacity style={styles.box} onPress={() => openURL('https://upstox.com')}>
          <Image
            source={require('../assets/upstox.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Box 3 - Zerodha */}
        <TouchableOpacity style={styles.box} onPress={() => openURL('https://zerodha.com')}>
          <Image
            source={require('../assets/zerodha.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Box 4 - INDmoney */}
        <TouchableOpacity style={styles.box} onPress={() => openURL('https://indmoney.com')}>
          <Image
            source={require('../assets/indmoney.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2A3B',
  },
  content: {
    padding: 20,
  },
  box: {
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  box1: {
    backgroundColor: '#66C3AC',
  },
  logoImage: {
    width: '105%',
    height: '105%',
  },
});

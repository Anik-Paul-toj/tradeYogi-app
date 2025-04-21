import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SafeAreaView, PanResponder, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: require('../assets/placeholder1.png'),
    title: 'Welcome To Trade Yogi',
    description: 'Stay updated with live market prices and trends to make informed decisions.',
  },
  {
    id: 2,
    image: require('../assets/placeholder2.png'),
    title: 'Smart Predictions',
    description: 'Get AI-powered insights to identify potential trading opportunities.',
  },
  {
    id: 3,
    image: require('../assets/placeholder3.png'),
    title: 'Portfolio Management',
    description: 'Track and manage your investments with our intuitive portfolio tools.',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startFloatingAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startFloatingAnimation();
  }, [currentIndex]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Handle swipe gesture
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50 && currentIndex > 0) {
        // Swipe right
        setCurrentIndex(currentIndex - 1);
      } else if (gestureState.dx < -50 && currentIndex < slides.length - 1) {
        // Swipe left
        setCurrentIndex(currentIndex + 1);
      }
    },
  });

  const handleSignIn = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/signup');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E2A3B', '#2C3E50']}
        style={styles.gradient}
      >
        <View style={styles.sliderContainer} {...panResponder.panHandlers}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.slide,
                { 
                  transform: [{ translateX: (index - currentIndex) * width }],
                  position: 'absolute',
                  left: 0,
                  right: 0,
                },
              ]}
            >
              <View style={styles.imageContainer}>
                <Animated.View
                  style={[
                    styles.imageWrapper,
                    {
                      transform: [
                        {
                          translateY: floatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -15],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Image source={slide.image} style={styles.image} />
                </Animated.View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A3B',
  },
  gradient: {
    flex: 1,
  },
  sliderContainer: {
    flex: 1,
    width,
    position: 'relative',
  },
  slide: {
    width,
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 5,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#E6F0FF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6F0FF',
    marginHorizontal: 5,
    opacity: 0.5,
  },
  paginationDotActive: {
    opacity: 1,
    width: 20,
  },
  button: {
    width: width * 0.8,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
 
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
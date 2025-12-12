import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions, useColorScheme } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    // Attendre 3 secondes puis fade-out
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#ffffff' }]}>
      {/* Image de fond pleine écran */}
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Overlay pour contraste en mode sombre */}
        {isDarkMode && <View style={styles.overlayDark} />}
      </Animated.View>

      {/* Texte WOY centré */}
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.logoText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
          WOY
        </Text>
        <Text style={[styles.tagline, { color: isDarkMode ? '#BDBDBD' : '#666666' }]}>
          What's On You
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
  },

  overlayDark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  logoText: {
    fontSize: 80,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 8,
  },

  tagline: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

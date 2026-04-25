import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function BrandLoader({ label = 'Loading Kora...' }: { label?: string }) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 950,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
        <Text style={styles.k}>K</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: AppTheme.colors.canvas,
  },
  mark: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: 'rgba(37,99,235,0.26)',
    borderTopColor: '#60A5FA',
  },
  k: { color: '#fff', fontWeight: '900', fontSize: 30 },
  label: { color: AppTheme.colors.textSecondary, fontWeight: '700' },
});

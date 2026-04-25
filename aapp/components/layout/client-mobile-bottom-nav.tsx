import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeMode } from '@/providers/theme-mode-provider';

export function ClientMobileBottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { scheme, theme } = useThemeMode();

  const items = [
    { key: 'index', label: 'Introduction', icon: (color: string) => <Ionicons name="home-outline" size={21} color={color} /> },
    { key: 'search', label: 'Doubts', icon: (color: string) => <Ionicons name="search-outline" size={21} color={color} /> },
    { key: 'bookings', label: 'Shipping', icon: (color: string) => <MaterialIcons name="book-online" size={21} color={color} /> },
    { key: 'account', label: 'Accounts', icon: (color: string) => <Feather name="user" size={20} color={color} /> },
  ];

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: theme.colors.navSurface,
          borderTopColor: theme.colors.navBorder,
        },
      ]}>
      {items.map((item) => {
        const routeIndex = state.routes.findIndex((r) => r.name === item.key);
        const focused = routeIndex === state.index;
        const color = focused ? theme.colors.brand : scheme === 'dark' ? theme.colors.muted : '#6B7280';
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => {
              if (routeIndex >= 0) navigation.navigate(state.routes[routeIndex].name);
            }}>
            {item.icon(color)}
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});

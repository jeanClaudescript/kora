import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ClientMobileBottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const items = [
    { key: 'index', label: 'Ahabanza', icon: (color: string) => <Ionicons name="home-outline" size={21} color={color} /> },
    { key: 'search', label: 'Shakisha', icon: (color: string) => <Ionicons name="search-outline" size={21} color={color} /> },
    { key: 'bookings', label: 'Gutumiza', icon: (color: string) => <MaterialIcons name="book-online" size={21} color={color} /> },
    { key: 'account', label: 'Konti', icon: (color: string) => <Feather name="user" size={20} color={color} /> },
  ];

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {items.map((item) => {
        const routeIndex = state.routes.findIndex((r) => r.name === item.key);
        const focused = routeIndex === state.index;
        const color = focused ? '#2563EB' : '#6B7280';
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
    borderTopColor: '#1e293b',
    backgroundColor: '#0b1736ee',
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

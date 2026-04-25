import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const bookings = [
  { id: '1', place: 'Amahoro Glow Salon', service: 'Wash & blow-dry', time: 'Today · 18:30' },
  { id: '2', place: 'Ikirezi Spa & Wellness', service: 'Express facial', time: 'Fri · 15:00' },
];

export default function BookingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My bookings</Text>
      <Text style={styles.subtitle}>Your upcoming and recent appointments.</Text>
      {bookings.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.place}>{item.place}</Text>
          <Text style={styles.service}>{item.service}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 24 },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 4, marginBottom: 14 },
  card: {
    borderRadius: AppTheme.radius.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    padding: 14,
    marginBottom: 10,
  },
  place: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 16 },
  service: { color: AppTheme.colors.textSecondary, marginTop: 3 },
  time: { color: AppTheme.colors.brand, marginTop: 6, fontWeight: '700' },
});

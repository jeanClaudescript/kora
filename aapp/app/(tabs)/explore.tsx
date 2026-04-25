import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { KoraCard } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';

const lanes = [
  'Customer recommendations + booking peace',
  'Business floor alerts and staffing targets',
  'Worker availability updates and ETA sharing',
  'Live booking desk actions from mobile',
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Kora mobile parity lane</Text>
      <Text style={styles.sub}>This screen replaces starter content and tracks what matches web experience.</Text>
      <KoraCard>
        <Text style={styles.blockTitle}>Feature parity checklist</Text>
        {lanes.map((lane) => (
          <View key={lane} style={styles.row}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.rowText}>{lane}</Text>
          </View>
        ))}
      </KoraCard>
      <KoraCard>
        <Text style={styles.blockTitle}>Branding</Text>
        <Text style={styles.rowText}>
          Kora identity is used in header, loader, and app navigation. Legacy starter visuals have been removed.
        </Text>
      </KoraCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  title: { color: AppTheme.colors.text, fontWeight: '900', fontSize: 25 },
  sub: { color: AppTheme.colors.textSecondary, marginTop: 2 },
  blockTitle: { color: AppTheme.colors.text, fontWeight: '900', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  dot: { color: '#2563eb', fontWeight: '900', marginTop: 1 },
  rowText: { flex: 1, color: AppTheme.colors.textSecondary, fontSize: 13, lineHeight: 18 },
});

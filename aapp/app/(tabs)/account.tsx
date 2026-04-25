import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { KoraCard, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { getBusinessDashboard } from '@/lib/api';
import { registerForPushNotificationsAsync, scheduleDemoNotification } from '@/lib/notifications';

export default function AccountScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [uiToggles, setUiToggles] = useState({
    compactChips: false,
    elevatedHeader: true,
    showImagePreviewStrip: true,
    workerQuickTogglePanel: true,
  });

  useEffect(() => {
    getBusinessDashboard()
      .then((data) => {
        if (data?.uiParity?.toggles) {
          setUiToggles((prev) => ({ ...prev, ...data.uiParity.toggles }));
        }
      })
      .catch(() => undefined);
  }, []);

  async function enableNotifications() {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      setToken(pushToken);
      Alert.alert('Notifications enabled', 'Push token generated for this device.');
    } catch (error) {
      Alert.alert('Unable to enable notifications', (error as Error).message);
    }
  }

  async function sendDemoReminder() {
    try {
      await scheduleDemoNotification();
      Alert.alert('Reminder scheduled', 'A local push notification will arrive in 5 seconds.');
    } catch (error) {
      Alert.alert('Failed', (error as Error).message);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Personalized by location, behavior, and your preferred categories.</Text>

      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your dynamic dashboard</Text>
        <Text style={styles.cardBody}>
          Location focus: Kigali · Top interests: Salon, Spa · Best booking window: 18:00 - 20:00
        </Text>
        <PrimaryButton label="Enable push notifications" onPress={enableNotifications} />
        <View style={{ marginTop: 10 }}>
          <SecondaryButton label="Send test reminder" onPress={sendDemoReminder} />
        </View>
        {token ? <Text style={styles.token}>Token: {token}</Text> : null}
      </View>
      </KoraCard>

      <KoraCard>
      <View style={styles.quickCard}>
        <Text style={styles.quickTitle}>Shortcuts</Text>
        <SecondaryButton label="Messages" onPress={() => router.push('/account/messages')} />
        <SecondaryButton label="My bookings" onPress={() => router.push('/account/trips')} />
        <SecondaryButton label="Search listings" onPress={() => router.push('/(tabs)/search')} />
        <SecondaryButton label="List your business" onPress={() => router.push('/auth/signup')} />
      </View>
      </KoraCard>

      <KoraCard>
        <View style={styles.quickCard}>
          <Text style={styles.quickTitle}>UI parity toggles (backend synced)</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Compact chips</Text>
            <Switch
              value={uiToggles.compactChips}
              onValueChange={(v) => setUiToggles((prev) => ({ ...prev, compactChips: v }))}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Elevated header</Text>
            <Switch
              value={uiToggles.elevatedHeader}
              onValueChange={(v) => setUiToggles((prev) => ({ ...prev, elevatedHeader: v }))}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Preview image strip</Text>
            <Switch
              value={uiToggles.showImagePreviewStrip}
              onValueChange={(v) => setUiToggles((prev) => ({ ...prev, showImagePreviewStrip: v }))}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Worker quick panel</Text>
            <Switch
              value={uiToggles.workerQuickTogglePanel}
              onValueChange={(v) => setUiToggles((prev) => ({ ...prev, workerQuickTogglePanel: v }))}
            />
          </View>
          <Text style={styles.toggleHint}>These toggles start from backend parity config and can be finalized per device.</Text>
        </View>
      </KoraCard>

      <KoraCard>
        <View style={styles.quickCard}>
          <Text style={styles.quickTitle}>Business live operations</Text>
          <Text style={styles.cardBody}>
            Real-time feed, automations, and fast staff controls built for 24/7 businesses.
          </Text>
          <PrimaryButton
            label="Download App"
            onPress={() => Linking.openURL('application-22fa0176-41e6-4353-91e8-112e185f942a.apk')}
          />
        </View>
      </KoraCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 24 },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 4, marginBottom: 14 },
  card: {},
  cardTitle: { color: AppTheme.colors.text, fontSize: 18, fontWeight: '800' },
  cardBody: { color: AppTheme.colors.textSecondary, marginTop: 6, marginBottom: 14 },
  token: { marginTop: 12, color: AppTheme.colors.muted, fontSize: 11 },
  quickCard: { marginTop: 12, gap: 8 },
  quickTitle: { color: AppTheme.colors.text, fontWeight: '800', marginBottom: 4 },
  toggleRow: {
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.elevatedMuted,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: { color: AppTheme.colors.text, fontSize: 13, fontWeight: '700' },
  toggleHint: { marginTop: 4, color: AppTheme.colors.textSecondary, fontSize: 12, lineHeight: 17 },
});

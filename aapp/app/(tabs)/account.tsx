import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { KoraCard, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { getBusinessDashboard } from '@/lib/api';
import { registerForPushNotificationsAsync, scheduleDemoNotification } from '@/lib/notifications';

export default function AccountScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [badge, setBadge] = useState('Trusted Booking Partner');

  useEffect(() => {
    getBusinessDashboard()
      .then((data) => setBadge(data?.reputation?.badge ?? 'Trusted Booking Partner'))
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
      <Text style={styles.subtitle}>Profile settings and notification controls.</Text>
      <Text style={styles.badge}>{badge}</Text>

      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Push notifications</Text>
        <Text style={styles.cardBody}>
          Match the client experience by reminding users about upcoming bookings.
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
        <SecondaryButton label="Sign in / switch account" onPress={() => router.push('/auth/login')} />
      </View>
      </KoraCard>

      <KoraCard>
        <View style={styles.quickCard}>
          <Text style={styles.quickTitle}>Growth and retention</Text>
          <Text style={styles.cardBody}>
            Enable always-on campaigns for businesses with reminders, re-booking nudges,
            and referral offers.
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
  badge: { marginBottom: 12, color: AppTheme.colors.brandDark, fontWeight: '800' },
  card: {},
  cardTitle: { color: AppTheme.colors.text, fontSize: 18, fontWeight: '800' },
  cardBody: { color: AppTheme.colors.textSecondary, marginTop: 6, marginBottom: 14 },
  token: { marginTop: 12, color: AppTheme.colors.muted, fontSize: 11 },
  quickCard: { marginTop: 12, gap: 8 },
  quickTitle: { color: AppTheme.colors.text, fontWeight: '800', marginBottom: 4 },
});

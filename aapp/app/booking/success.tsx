import * as Linking from 'expo-linking';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { KoraCard, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';

function buildWaLink(whatsapp: string, text: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function BookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    status?: string;
    listingName: string;
    listingSlug: string;
    serviceName: string;
    slotLabel: string;
    customerName: string;
    phone: string;
    whatsapp: string;
  }>();

  if (!params.whatsapp) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Booking data missing</Text>
        <Link href="/(tabs)/search" style={styles.link}>
          Back to search
        </Link>
      </View>
    );
  }

  const message = `Hello ${params.listingName}, I booked on Kora:\n• ${params.serviceName}\n• ${params.slotLabel}\n• Name: ${params.customerName}\n• Phone: ${params.phone}\nPlease confirm. Thank you!`;

  async function openWhatsapp() {
    try {
      await Linking.openURL(buildWaLink(params.whatsapp, message));
    } catch {
      Alert.alert('Unable to open WhatsApp', 'Please install WhatsApp or try again later.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.check}>
        <Text style={styles.checkText}>✓</Text>
      </View>
      <Text style={styles.title}>Booking request sent</Text>
      <Text style={styles.sub}>Next step: confirm details directly on WhatsApp with the business.</Text>

      <KoraCard>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Summary</Text>
        {params.bookingId ? <Text style={styles.summaryItem}>Booking ID: {params.bookingId}</Text> : null}
        <Text style={styles.summaryItem}>Service: {params.serviceName}</Text>
        <Text style={styles.summaryItem}>Time: {params.slotLabel}</Text>
        <Text style={styles.summaryItem}>Name: {params.customerName}</Text>
        {params.status ? <Text style={styles.summaryItem}>Status: {params.status}</Text> : null}
      </View>
      </KoraCard>

      <View style={styles.btnWrap}>
        <PrimaryButton label="Open WhatsApp" onPress={openWhatsapp} />
      </View>
      <View style={styles.btnWrap}>
        <SecondaryButton label="View my bookings" onPress={() => router.push('/(tabs)/bookings')} />
      </View>
      <Link href="/(tabs)" style={styles.homeLink}>
        Back home
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 90, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.colors.canvas },
  check: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: AppTheme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  checkText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  title: { marginTop: 14, color: AppTheme.colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  sub: { marginTop: 8, color: AppTheme.colors.textSecondary, textAlign: 'center', paddingHorizontal: 8 },
  summary: { marginTop: 6, width: '100%', gap: 6 },
  summaryTitle: { color: AppTheme.colors.text, fontWeight: '800' },
  summaryItem: { color: AppTheme.colors.textSecondary },
  btnWrap: { width: '100%', marginTop: 10 },
  homeLink: { marginTop: 12, color: AppTheme.colors.brand, fontWeight: '700' },
  link: { marginTop: 10, color: AppTheme.colors.brand, fontWeight: '700' },
});

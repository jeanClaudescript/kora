import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { KoraCard, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { listings } from '@/data/catalog';

function formatRwf(value: number) {
  return `RWF ${value.toLocaleString()}`;
}

const demoTrips = [
  { id: '1', listing: listings[0], service: 'Wash & blow-dry', when: 'Tomorrow · 10:30', status: 'Confirmed on WhatsApp' },
  { id: '2', listing: listings[1], service: 'Haircut + beard', when: 'Fri 18 Apr · 16:00', status: 'Awaiting reply' },
];

export default function AccountTripsScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My bookings</Text>
      <Text style={styles.sub}>Calendar-style list matching the client view.</Text>
      {demoTrips.map((trip) => (
        <KoraCard key={trip.id}>
        <View style={styles.card}>
          <View style={styles.left}>
            <Image source={{ uri: trip.listing.image }} style={styles.image} contentFit="cover" />
            <View>
              <Text style={styles.name}>{trip.listing.name}</Text>
              <Text style={styles.meta}>{trip.service}</Text>
              <Text style={styles.when}>{trip.when}</Text>
              <Text style={styles.status}>{trip.status}</Text>
            </View>
          </View>
          <Text style={styles.price}>From {formatRwf(trip.listing.priceFromRwf)}</Text>
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <SecondaryButton label="View listing" onPress={() => router.push({ pathname: '/listing/[slug]', params: { slug: trip.listing.slug } })} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton label="Message on WhatsApp" />
            </View>
          </View>
        </View>
        </KoraCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 90, gap: 10 },
  title: { color: AppTheme.colors.text, fontSize: 25, fontWeight: '900' },
  sub: { color: AppTheme.colors.textSecondary, marginBottom: 6 },
  card: { gap: 8 },
  left: { flexDirection: 'row', gap: 10 },
  image: { width: 96, height: 72, borderRadius: 10 },
  name: { color: AppTheme.colors.text, fontWeight: '800' },
  meta: { color: AppTheme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  when: { color: AppTheme.colors.text, fontWeight: '700', marginTop: 3, fontSize: 13 },
  status: { color: AppTheme.colors.success, fontWeight: '700', fontSize: 12, marginTop: 2 },
  price: { color: AppTheme.colors.text, fontWeight: '800', alignSelf: 'flex-end' },
  actions: { flexDirection: 'row', gap: 8 },
});

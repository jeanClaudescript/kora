import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { KoraCard, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { getListing } from '@/data/catalog';

function formatRwf(value: number) {
  return `RWF ${value.toLocaleString()}`;
}

function formatDuration(min: number) {
  if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
  return `${min}m`;
}

export default function ListingDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const listing = getListing(slug);

  if (!listing) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTitle}>Listing not found</Text>
        <Link href="/(tabs)/search" style={styles.notFoundLink}>
          Back to search
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: listing.image }} style={styles.hero} contentFit="cover" />
      <Text style={styles.name}>{listing.name}</Text>
      <Text style={styles.meta}>
        {listing.area}, {listing.city} · Open until {listing.openUntil}
      </Text>
      <Text style={styles.tagline}>{listing.tagline}</Text>
      <Text style={styles.memberMeta}>Member since {listing.memberSince} · {listing.languages.join(', ')}</Text>

      <View style={styles.highlightWrap}>
        {listing.highlights.map((item) => (
          <View key={item} style={styles.highlight}>
            <Text style={styles.highlightText}>✓ {item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Services & prices</Text>
      {listing.services.map((service) => (
        <KoraCard key={service.id}>
          <View style={styles.serviceCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceMeta}>{formatDuration(service.durationMin)}</Text>
            {service.description ? <Text style={styles.serviceDesc}>{service.description}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <Text style={styles.servicePrice}>{formatRwf(service.priceRwf)}</Text>
            <View style={styles.selectBtnWrap}>
              <SecondaryButton
                label="Select"
                onPress={() =>
                  router.push({ pathname: '/booking/[slug]', params: { slug: listing.slug, service: service.id } })
                }
              />
            </View>
          </View>
          </View>
        </KoraCard>
      ))}

      <PrimaryButton
        label="Check availability"
        onPress={() => router.push({ pathname: '/booking/[slug]', params: { slug: listing.slug } })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 90 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.colors.canvas },
  notFoundTitle: { fontWeight: '800', fontSize: 22, color: AppTheme.colors.text },
  notFoundLink: { marginTop: 12, color: AppTheme.colors.brand, fontWeight: '700' },
  hero: { width: '100%', height: 220, borderRadius: AppTheme.radius.card },
  name: { marginTop: 12, color: AppTheme.colors.text, fontWeight: '900', fontSize: 28 },
  meta: { marginTop: 4, color: AppTheme.colors.textSecondary },
  tagline: { marginTop: 10, color: AppTheme.colors.textSecondary, lineHeight: 21 },
  memberMeta: { marginTop: 6, color: AppTheme.colors.muted, fontSize: 12 },
  highlightWrap: { marginTop: 12, gap: 8 },
  highlight: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  highlightText: { color: AppTheme.colors.text, fontWeight: '600' },
  sectionTitle: { marginTop: 18, marginBottom: 10, color: AppTheme.colors.text, fontWeight: '800', fontSize: 18 },
  serviceCard: { marginBottom: 0, flexDirection: 'row', gap: 10 },
  serviceName: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 15 },
  serviceMeta: { marginTop: 2, color: AppTheme.colors.muted, fontSize: 12 },
  serviceDesc: { marginTop: 4, color: AppTheme.colors.textSecondary, fontSize: 12 },
  servicePrice: { color: AppTheme.colors.text, fontWeight: '900' },
  selectBtnWrap: { minWidth: 88 },
});

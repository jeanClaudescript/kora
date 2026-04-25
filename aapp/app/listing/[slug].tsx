import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const [selectedImage, setSelectedImage] = useState(0);

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

  const images = [listing.image, ...listing.gallery];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: images[selectedImage] }} style={styles.hero} contentFit="cover" />
      <View style={styles.heroBadges}>
        {listing.instantConfirm ? <Text style={styles.badgeInstant}>Instant request</Text> : null}
        <Text style={listing.busyNow ? styles.badgeBusy : styles.badgeOpen}>
          {listing.busyNow ? 'Busy now' : 'Accepting bookings'}
        </Text>
      </View>
      <View style={styles.previewStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
          {images.map((src, idx) => (
            <Pressable
              key={`${src}-${idx}`}
              onPress={() => setSelectedImage(idx)}
              style={[styles.previewItem, idx === selectedImage ? styles.previewItemActive : undefined]}>
              <Image source={{ uri: src }} style={styles.previewImage} contentFit="cover" />
              {idx === selectedImage ? <View style={styles.previewDot} /> : null}
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.name}>{listing.name}</Text>
      <Text style={styles.meta}>
        {listing.area}, {listing.city} · Open until {listing.openUntil}
      </Text>
      <Text style={styles.ratingMeta}>
        {listing.rating.toFixed(1)} ({listing.reviews.toLocaleString()} reviews)
      </Text>
      <Text style={styles.tagline}>{listing.tagline}</Text>
      <Text style={styles.memberMeta}>Member since {listing.memberSince} · {listing.languages.join(', ')}</Text>
      <View style={styles.tabRow}>
        {['Overview', 'Services', 'Reviews', 'Location'].map((tab) => (
          <View key={tab} style={styles.tabChip}>
            <Text style={styles.tabChipText}>{tab}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.overviewTitle}>Overview</Text>
      <Text style={styles.overviewBody}>
        {listing.tagline} Member since {listing.memberSince}. Languages: {listing.languages.join(', ')}.
      </Text>

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
      <Text style={styles.availabilityHint}>You’ll pick service & time next — max three screens.</Text>

      <View style={styles.walkinsCard}>
        <Text style={styles.walkinsTitle}>Walk-ins & real life</Text>
        <Text style={styles.walkinsBody}>
          Popular shops can serve walk-ins. Times may shift slightly — we keep updates clear and push final confirmation quickly.
        </Text>
      </View>
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
  heroBadges: { marginTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badgeInstant: {
    borderRadius: 999,
    backgroundColor: '#059669',
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeBusy: {
    borderRadius: 999,
    backgroundColor: '#f97316',
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeOpen: {
    borderRadius: 999,
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  previewStrip: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#08142f',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  previewRow: { gap: 8 },
  previewItem: {
    width: 88,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  previewItemActive: {
    borderColor: '#7dd3fc',
    borderWidth: 2,
  },
  previewImage: { width: '100%', height: '100%' },
  previewDot: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#f43f5e',
  },
  name: { marginTop: 12, color: AppTheme.colors.text, fontWeight: '900', fontSize: 28 },
  meta: { marginTop: 4, color: AppTheme.colors.textSecondary },
  tagline: { marginTop: 10, color: AppTheme.colors.textSecondary, lineHeight: 21 },
  ratingMeta: { marginTop: 6, color: AppTheme.colors.textSecondary, fontWeight: '700', fontSize: 13 },
  memberMeta: { marginTop: 6, color: AppTheme.colors.muted, fontSize: 12 },
  tabRow: {
    marginTop: 14,
    marginBottom: 4,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tabChip: {
    borderRadius: 999,
    backgroundColor: '#1e3358',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabChipText: { color: '#f8fafc', fontSize: 12, fontWeight: '800' },
  overviewTitle: { marginTop: 12, color: AppTheme.colors.text, fontSize: 30 / 2, fontWeight: '900' },
  overviewBody: { marginTop: 6, color: AppTheme.colors.textSecondary, fontSize: 13, lineHeight: 19 },
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
  walkinsCard: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#facc15',
    backgroundColor: '#fef9c3',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  walkinsTitle: { color: '#854d0e', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  walkinsBody: { marginTop: 4, color: '#713f12', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  availabilityHint: {
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
    color: AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import type { Listing } from '@/data/catalog';

type Props = {
  listing: Listing;
};

function formatRwf(value: number) {
  return `RWF ${value.toLocaleString()}`;
}

export function ListingCard({ listing }: Props) {
  const router = useRouter();
  const statusLabel = listing.busyNow ? 'Busy' : 'Open';

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/listing/${listing.slug}`)}>
      <Image source={{ uri: listing.image }} style={styles.image} contentFit="cover" />
      <View style={styles.badges}>
        {listing.badges.slice(0, 3).map((badge) => (
          <Text key={badge} style={styles.badge}>
            {badge === 'topRated' ? 'TOP RATED' : badge === 'almostFull' ? 'ALMOST FULL' : 'POPULAR'}
          </Text>
        ))}
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{listing.category}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{listing.name}</Text>
          <View style={[styles.statusPill, listing.busyNow ? styles.statusBusy : styles.statusOpen]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={styles.tagline}>{listing.tagline}</Text>
        <Text style={styles.metaText}>Location: {listing.area}, {listing.city}</Text>
        <Text style={styles.metaText}>Rating: {listing.rating.toFixed(1)} from {listing.reviews} reviews</Text>
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.price}>{formatRwf(listing.priceFromRwf)}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push({ pathname: '/booking/[slug]', params: { slug: listing.slug } })}>
            <Text style={styles.bookBtnText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    overflow: 'hidden',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 185,
  },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#fef3c7',
    color: '#3f3f46',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  body: {
    padding: 12,
    gap: 6,
  },
  category: {
    color: AppTheme.colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 34 / 2,
    fontWeight: '800',
    flex: 1,
  },
  tagline: {
    color: AppTheme.colors.textSecondary,
    fontSize: 15 / 1,
  },
  titleRow: {
    marginTop: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusBusy: { backgroundColor: '#f97316' },
  statusOpen: { backgroundColor: '#10b981' },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  metaText: {
    color: AppTheme.colors.textSecondary,
    fontSize: 14,
  },
  bottomRow: { marginTop: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: AppTheme.colors.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: '700' },
  price: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    fontSize: 28 / 2,
  },
  bookBtn: {
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bookBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

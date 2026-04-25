import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Listing } from '@/data/catalog';
import { useAppTheme } from '@/hooks/use-app-theme';

export function SpotlightCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Pressable
      style={[
        styles.card,
        { borderColor: theme.colors.brand, backgroundColor: theme.colors.elevated, shadowColor: theme.colors.brandDark },
      ]}
      onPress={() => router.push(`/listing/${listing.slug}`)}>
      <View style={styles.imgWrap}>
        <Image source={{ uri: listing.image }} style={styles.image} contentFit="cover" />
        <View style={styles.topBadges}>
          <View style={[styles.badge, { backgroundColor: '#d1fae5' }]}>
            <Text style={[styles.badgeText, { color: '#065f46' }]}>GOOD NOTES</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#fb7185' }]}>
            <Text style={[styles.badgeText, { color: '#fff' }]}>IT’S ALMOST PERFECT</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.category, { color: theme.colors.muted }]}>{listing.category}</Text>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {listing.name}
        </Text>
        <Text style={[styles.desc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {listing.tagline}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
            ★ {listing.rating.toFixed(1)} ({listing.reviews} comments)
          </Text>
          <Text style={[styles.price, { color: theme.colors.text }]}>RF {listing.priceFromRwf.toLocaleString()}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.small, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            From the Truth
          </Text>
          <View style={[styles.cta, { backgroundColor: theme.colors.brand }]}>
            <Text style={styles.ctaText}>Send</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    borderRadius: 22,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  imgWrap: { height: 145 },
  image: { width: '100%', height: '100%' },
  topBadges: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', gap: 8 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '900' },
  body: { padding: 12, gap: 6 },
  category: { fontSize: 12, fontWeight: '800' },
  title: { fontSize: 18, fontWeight: '900' },
  desc: { fontSize: 12, lineHeight: 16 },
  metaRow: { marginTop: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rating: { fontSize: 12, fontWeight: '700' },
  price: { fontSize: 12, fontWeight: '900' },
  footerRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  small: { fontSize: 11, fontWeight: '700' },
  cta: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9 },
  ctaText: { color: '#fff', fontWeight: '900', fontSize: 12 },
});


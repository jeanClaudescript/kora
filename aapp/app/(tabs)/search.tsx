import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ListingCard } from '@/components/listing-card';
import { KoraInput, PillChip } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { categories, listings } from '@/data/catalog';
import { getCustomerDashboard, searchListingsApi } from '@/lib/api';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState(params.category ?? 'all');
  const [results, setResults] = useState(listings);
  const [uiParity, setUiParity] = useState({
    spacing: { screen: 16, chipGap: 8 },
    typography: { h2: 24, body: 14 },
    toggles: { compactChips: false, boldSectionTitles: true },
  });

  useEffect(() => {
    setQuery(params.q ?? '');
    setCategory(params.category ?? 'all');
  }, [params.q, params.category]);

  useEffect(() => {
    searchListingsApi({ q: query, category: category === 'all' ? '' : category })
      .then((items) => setResults(items))
      .catch(() => setResults([]));
  }, [query, category]);

  useEffect(() => {
    getCustomerDashboard('guest', { city: 'Kigali' })
      .then((data) => {
        const spacing = data?.uiParity?.tokens?.spacing;
        const type = data?.uiParity?.tokens?.typography;
        const toggles = data?.uiParity?.toggles;
        setUiParity((prev) => ({
          spacing: {
            screen: Number(spacing?.screen || prev.spacing.screen),
            chipGap: Number(spacing?.chipGap || prev.spacing.chipGap),
          },
          typography: {
            h2: Number(type?.h2 || prev.typography.h2),
            body: Number(type?.body || prev.typography.body),
          },
          toggles: { ...prev.toggles, ...(toggles || {}) },
        }));
      })
      .catch(() => undefined);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { padding: uiParity.spacing.screen }]}>
      <Text
        style={[
          styles.title,
          {
            fontSize: uiParity.typography.h2,
            fontWeight: uiParity.toggles.boldSectionTitles ? '900' : '800',
          },
        ]}>
        Find your next appointment
      </Text>
      <Text style={[styles.subtitle, { fontSize: uiParity.typography.body }]}>
        {results.length} places match your filters - refine like Booking.com, browse like a marketplace.
      </Text>
      <KoraInput value={query} onChangeText={setQuery} placeholder="Salon, spa, nails..." />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.chips,
          {
            gap: uiParity.toggles.compactChips ? Math.max(uiParity.spacing.chipGap - 2, 4) : uiParity.spacing.chipGap,
            paddingVertical: uiParity.toggles.compactChips ? 10 : 12,
          },
        ]}>
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <PillChip key={cat.id} label={`${cat.icon} ${cat.label}`} active={active} onPress={() => setCategory(cat.id)} />
          );
        })}
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {query ? `"${query}" · ` : ''}
          {category !== 'all' ? `${category} · ` : ''}
          {results.length} matches
        </Text>
      </View>
      {results.map((listing) => (
        <ListingCard key={listing.slug} listing={listing} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 24 },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 4, marginBottom: 10 },
  chips: { paddingVertical: 12, gap: 8 },
  resultHeader: { marginBottom: 8 },
  resultCount: { color: AppTheme.colors.textSecondary, fontWeight: '600' },
});

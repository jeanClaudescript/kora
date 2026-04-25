import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ListingCard } from '@/components/listing-card';
import { KoraInput, PillChip } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { categories, listings } from '@/data/catalog';
import { searchListingsApi } from '@/lib/api';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState(params.category ?? 'all');
  const [results, setResults] = useState(listings);

  useEffect(() => {
    setQuery(params.q ?? '');
    setCategory(params.category ?? 'all');
  }, [params.q, params.category]);

  useEffect(() => {
    searchListingsApi({ q: query, category: category === 'all' ? '' : category })
      .then((items) => setResults(items))
      .catch(() => setResults([]));
  }, [query, category]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Find your next appointment</Text>
      <Text style={styles.subtitle}>Filter like the web app and browse mobile cards.</Text>
      <KoraInput value={query} onChangeText={setQuery} placeholder="Salon, spa, nails..." />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <PillChip key={cat.id} label={`${cat.icon} ${cat.label}`} active={active} onPress={() => setCategory(cat.id)} />
          );
        })}
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>{results.length} matches</Text>
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

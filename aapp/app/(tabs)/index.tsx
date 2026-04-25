import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SpotlightCard } from '@/components/spotlight-card';
import { AppTheme } from '@/constants/app-theme';
import { categories, listings } from '@/data/catalog';
import { getCustomerDashboard, getListings } from '@/lib/api';

type VisitRow = {
  id: string;
  serviceName: string;
  slotLabel: string;
  venueName: string;
  area?: string;
  city?: string;
  mapUrl?: string;
  status?: string;
};

type DashPayload = {
  mindset?: { likelyIntent?: string; joyHook?: string; needSummary?: string };
  recentVisits?: VisitRow[];
  bookingPeace?: {
    policySummary?: string;
    reminderCadence?: string[];
    tips?: { id: string; title: string; body: string }[];
    noShowGraceMinutes?: number;
  };
  uiParity?: {
    tokens?: { spacing?: { screen?: number; chipGap?: number }; typography?: { h1?: number } };
    toggles?: { boldSectionTitles?: boolean };
  };
};

export default function HomeScreen() {
  const [dash, setDash] = useState<DashPayload | null>(null);
  const [liveListings, setLiveListings] = useState(listings);
  const [category, setCategory] = useState('all');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const screenPad = Number(dash?.uiParity?.tokens?.spacing?.screen || 16);
  const titleSize = Number(dash?.uiParity?.tokens?.typography?.h1 || 30);
  const boldTitle = dash?.uiParity?.toggles?.boldSectionTitles ?? true;
  const filteredListings =
    category === 'all' ? liveListings : liveListings.filter((item) => item.category === category);
  const selectedCategory = categories.find((c) => c.id === category) ?? categories[0];

  useEffect(() => {
    getCustomerDashboard('guest', { city: 'Kigali', visitStyle: 'balanced' })
      .then((data) => setDash(data as DashPayload))
      .catch(() => setDash(null));
    getListings()
      .then((items) => {
        if (items.length) setLiveListings(items);
      })
      .catch(() => undefined);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { padding: screenPad }]}>
      <Text style={styles.kicker}>RECOMMENDED FOR YOU</Text>
      <Text style={[styles.title, { fontSize: titleSize, fontWeight: boldTitle ? '900' : '800' }]}>
        Book trusted services across Kigali
      </Text>
      <Text style={styles.subtitle}>Discover top-rated salons, spas and local services with a clean booking flow.</Text>
      {dash?.mindset?.likelyIntent ? <Text style={styles.insight}>{dash.mindset.likelyIntent}</Text> : null}
      <Text style={styles.insightSub}>
        Short hops from where you already are — less zig-zag. · One thread that remembers your last visit and preferences.
      </Text>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Featured spots</Text>
        <Text style={styles.sectionMore}>...</Text>
      </View>
      <View style={styles.dropdownWrap}>
        <Text style={styles.dropdownLabel}>Category</Text>
        <Pressable style={styles.dropdownBtn} onPress={() => setCategoryOpen((v) => !v)}>
          <Text style={styles.dropdownBtnText}>
            {selectedCategory.icon} {selectedCategory.label}
          </Text>
          <Text style={styles.dropdownCaret}>{categoryOpen ? '▴' : '▾'}</Text>
        </Pressable>
        {categoryOpen ? (
          <View style={styles.dropdownList}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={[styles.dropdownItem, c.id === category && styles.dropdownItemActive]}
                onPress={() => {
                  setCategory(c.id);
                  setCategoryOpen(false);
                }}
              >
                <Text style={[styles.dropdownItemText, c.id === category && styles.dropdownItemTextActive]}>
                  {c.icon} {c.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {filteredListings.slice(0, 6).map((listing) => (
          <SpotlightCard key={listing.slug} listing={listing} />
        ))}
      </ScrollView>

      <Text style={styles.seeMore}>See more</Text>
      <Text style={styles.seeMoreSub}>View all listings</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.canvas,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  kicker: {
    color: AppTheme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    color: AppTheme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: AppTheme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  insight: { marginTop: 10, color: '#2563EB', fontSize: 13, fontWeight: '800', lineHeight: 18, textAlign: 'center' },
  insightSub: {
    marginTop: 8,
    color: AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
  sectionHead: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: AppTheme.colors.text },
  sectionMore: { fontSize: 18, fontWeight: '900', color: AppTheme.colors.textSecondary },
  dropdownWrap: { marginTop: 6 },
  dropdownLabel: { fontSize: 11, fontWeight: '800', color: AppTheme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  dropdownBtn: {
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownBtnText: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 13 },
  dropdownCaret: { color: AppTheme.colors.muted, fontWeight: '900' },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.elevated,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.line,
  },
  dropdownItemActive: { backgroundColor: AppTheme.colors.brandSoft },
  dropdownItemText: { color: AppTheme.colors.text, fontSize: 13, fontWeight: '700' },
  dropdownItemTextActive: { color: AppTheme.colors.brandDark, fontWeight: '900' },
  row: { gap: 14, paddingVertical: 10, paddingRight: 12 },
  seeMore: { marginTop: 14, textAlign: 'center', color: '#2563EB', fontWeight: '800' },
  seeMoreSub: { marginTop: 4, textAlign: 'center', color: AppTheme.colors.textSecondary, fontWeight: '700' },
});

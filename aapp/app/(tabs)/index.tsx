import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { ListingCard } from '@/components/listing-card';
import { KoraCard, KoraInput, PillChip, PrimaryButton } from '@/components/ui/primitives';
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
    tips?: Array<{ id: string; title: string; body: string }>;
    noShowGraceMinutes?: number;
  };
};

export default function HomeScreen() {
  const [dash, setDash] = useState<DashPayload | null>(null);
  const [liveListings, setLiveListings] = useState(listings);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>RECOMMENDED FOR YOU</Text>
      <Text style={styles.title}>Book trusted services across Kigali</Text>
      <Text style={styles.subtitle}>
        Discover top-rated salons, spas and local services with a clean booking flow.
      </Text>
      {dash?.mindset?.likelyIntent ? <Text style={styles.insight}>{dash.mindset.likelyIntent}</Text> : null}
      {dash?.mindset?.joyHook && dash?.mindset?.needSummary ? (
        <Text style={styles.insightSub}>
          {dash.mindset.joyHook} · {dash.mindset.needSummary}
        </Text>
      ) : null}

      {dash?.recentVisits?.length ? (
        <KoraCard>
          <Text style={styles.visitTitle}>{"Where you're headed"}</Text>
          <Text style={styles.visitHint}>Open maps for each stop.</Text>
          {dash.recentVisits.map((v) => (
            <View key={v.id} style={styles.visitRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.visitVenue}>{v.venueName}</Text>
                <Text style={styles.visitMeta}>
                  {v.serviceName} · {v.area}, {v.city}
                </Text>
              </View>
              {v.mapUrl ? (
                <Pressable style={styles.mapBtn} onPress={() => Linking.openURL(v.mapUrl!)}>
                  <Text style={styles.mapBtnText}>Map</Text>
                </Pressable>
              ) : null}
            </View>
          ))}
        </KoraCard>
      ) : null}

      {dash?.bookingPeace?.tips?.length ? (
        <KoraCard>
          <Text style={styles.visitTitle}>Booking peace of mind</Text>
          <Text style={styles.visitHint}>{dash.bookingPeace.policySummary}</Text>
          {dash.bookingPeace.reminderCadence?.length ? (
            <Text style={styles.cadence}>{dash.bookingPeace.reminderCadence.join(' · ')}</Text>
          ) : null}
          {dash.bookingPeace.tips.map((tip) => (
            <View key={tip.id} style={styles.tipBlock}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
            </View>
          ))}
        </KoraCard>
      ) : null}

      <KoraCard>
        <View style={styles.searchPanel}>
          <KoraInput placeholder="Service name" />
          <KoraInput placeholder="City (Kigali)" />
          <PrimaryButton label="Search" />
        </View>
      </KoraCard>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map((cat) => (
          <PillChip key={cat.id} label={`${cat.icon} ${cat.label}`} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Featured spots</Text>
      {liveListings.map((listing) => (
        <ListingCard key={listing.slug} listing={listing} />
      ))}

      <KoraCard>
        <Text style={styles.businessTitle}>Business live operations</Text>
        <Text style={styles.businessSub}>
          Real-time feed, automations, and fast staff controls built for 24/7 businesses.
        </Text>
        <View style={styles.businessList}>
          {[
            'Live booking activity feed',
            'Smart slot fill and delay actions',
            'Retention campaigns and reminders',
          ].map((item) => (
            <Text key={item} style={styles.businessItem}>
              • {item}
            </Text>
          ))}
        </View>
        <View style={{ marginTop: 10 }}>
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
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.canvas,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  kicker: {
    color: AppTheme.colors.brand,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  title: {
    marginTop: 4,
    color: AppTheme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    color: AppTheme.colors.textSecondary,
    fontSize: 14,
  },
  insight: { marginTop: 8, color: '#7c3aed', fontSize: 13, fontWeight: '800', lineHeight: 18 },
  insightSub: {
    marginTop: 6,
    color: AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  visitTitle: { fontSize: 16, fontWeight: '900', color: AppTheme.colors.text },
  visitHint: { marginTop: 4, fontSize: 12, color: AppTheme.colors.textSecondary, marginBottom: 10 },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.line,
  },
  visitVenue: { fontSize: 15, fontWeight: '800', color: AppTheme.colors.text },
  visitMeta: { marginTop: 2, fontSize: 12, color: AppTheme.colors.textSecondary },
  mapBtn: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#db2777',
  },
  mapBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  cadence: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  tipBlock: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: AppTheme.colors.line },
  tipTitle: { fontSize: 14, fontWeight: '900', color: AppTheme.colors.text },
  tipBody: { marginTop: 4, fontSize: 12, color: AppTheme.colors.textSecondary, lineHeight: 17 },
  searchPanel: { marginTop: 2, gap: 8 },
  chips: {
    gap: 8,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: 10,
  },
  businessTitle: { color: AppTheme.colors.text, fontSize: 18, fontWeight: '900' },
  businessSub: { marginTop: 4, color: AppTheme.colors.textSecondary, fontSize: 13 },
  businessList: { marginTop: 8, gap: 3 },
  businessItem: { color: AppTheme.colors.text, fontWeight: '600', fontSize: 13 },
});

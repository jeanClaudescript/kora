import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraCard, KoraInput, PrimaryButton, SecondaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { getListing } from '@/data/catalog';

const SLOTS = [
  { id: '1', label: '09:00' },
  { id: '2', label: '09:30', disabled: true },
  { id: '3', label: '10:00' },
  { id: '4', label: '10:30' },
  { id: '5', label: '11:00', disabled: true },
  { id: '6', label: '11:30' },
  { id: '7', label: '14:00' },
  { id: '8', label: '15:30' },
];

function formatRwf(value: number) {
  return `RWF ${value.toLocaleString()}`;
}

export default function BookingScreen() {
  const router = useRouter();
  const { slug, service } = useLocalSearchParams<{ slug: string; service?: string }>();
  const listing = getListing(slug);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const preService = useMemo(
    () => listing?.services.find((item) => item.id === service) ?? null,
    [listing, service],
  );
  const [pickedServiceId, setPickedServiceId] = useState<string | null>(preService?.id ?? null);
  const selectedService = listing?.services.find((item) => item.id === pickedServiceId) ?? preService;
  const [slotId, setSlotId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

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

  const canStep1 = !!selectedService;
  const slot = SLOTS.find((item) => item.id === slotId);
  const canStep2 = !!slot && !slot.disabled;
  const canStep3 = name.trim().length >= 2 && phone.trim().length >= 8;

  function confirmBooking() {
    if (!selectedService || !slot) return;
    router.push({
      pathname: '/booking/success',
      params: {
        listingName: listing.name,
        listingSlug: listing.slug,
        serviceName: selectedService.name,
        slotLabel: slot.label,
        customerName: name.trim(),
        phone: phone.trim(),
        whatsapp: listing.whatsapp,
      },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete your booking</Text>
      <Text style={styles.subtitle}>
        Step {step} of 3 · {listing.name}
      </Text>

      {step === 1 ? (
        <KoraCard>
        <View style={styles.panel}>
          <Text style={styles.panelHint}>Choose one service.</Text>
          {listing.services.map((item) => {
            const active = selectedService?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.serviceItem, active && styles.serviceItemActive]}
                onPress={() => setPickedServiceId(item.id)}>
                <View>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.serviceMeta}>{item.durationMin} min</Text>
                </View>
                <Text style={styles.servicePrice}>{formatRwf(item.priceRwf)}</Text>
              </TouchableOpacity>
            );
          })}
          <PrimaryButton label="Continue to time" disabled={!canStep1} onPress={() => setStep(2)} />
        </View>
        </KoraCard>
      ) : null}

      {step === 2 ? (
        <KoraCard>
        <View style={styles.panel}>
          <Text style={styles.panelHint}>Select preferred slot.</Text>
          <View style={styles.slotGrid}>
            {SLOTS.map((item) => {
              const active = slotId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  disabled={!!item.disabled}
                  style={[styles.slot, active && styles.slotActive, item.disabled && styles.disabled]}
                  onPress={() => setSlotId(item.id)}>
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SecondaryButton label="Back" onPress={() => setStep(1)} />
            </View>
            <TouchableOpacity
              disabled={!canStep2}
              style={[styles.primaryBtn, !canStep2 && styles.disabled, { flex: 2 }]}
              onPress={() => setStep(3)}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KoraCard>
      ) : null}

      {step === 3 ? (
        <KoraCard>
        <View style={styles.panel}>
          <Text style={styles.summaryText}>
            {selectedService?.name} · {slot?.label}
          </Text>
          <KoraInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />
          <KoraInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Mobile number"
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SecondaryButton label="Back" onPress={() => setStep(2)} />
            </View>
            <TouchableOpacity
              disabled={!canStep3}
              style={[styles.primaryBtn, !canStep3 && styles.disabled, { flex: 2 }]}
              onPress={confirmBooking}>
              <Text style={styles.primaryBtnText}>Confirm booking</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KoraCard>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 90 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.colors.canvas },
  notFoundTitle: { fontWeight: '800', fontSize: 22, color: AppTheme.colors.text },
  notFoundLink: { marginTop: 12, color: AppTheme.colors.brand, fontWeight: '700' },
  title: { color: AppTheme.colors.text, fontWeight: '900', fontSize: 28 },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 4, marginBottom: 12 },
  panel: { gap: 10 },
  panelHint: { color: AppTheme.colors.textSecondary, fontSize: 13 },
  serviceItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceItemActive: { borderColor: AppTheme.colors.brand, backgroundColor: '#eff6ff' },
  serviceName: { color: AppTheme.colors.text, fontWeight: '800' },
  serviceMeta: { color: AppTheme.colors.muted, fontSize: 12, marginTop: 2 },
  servicePrice: { color: AppTheme.colors.text, fontWeight: '800' },
  primaryBtn: {
    backgroundColor: AppTheme.colors.brand,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    flex: 1,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  disabled: { opacity: 0.4 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    width: '23%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevatedMuted,
    alignItems: 'center',
    paddingVertical: 10,
  },
  slotActive: { backgroundColor: '#dbeafe', borderColor: AppTheme.colors.brand },
  slotText: { color: AppTheme.colors.text, fontWeight: '700', fontSize: 12 },
  slotTextActive: { color: AppTheme.colors.brandDark },
  row: { flexDirection: 'row', gap: 10 },
  summaryText: { color: AppTheme.colors.text, fontWeight: '700' },
});

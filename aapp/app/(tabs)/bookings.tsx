import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import { getBusinessBookings, updateBusinessBookingStatus } from '@/lib/api';

type BookingRow = {
  bookingId?: string;
  _id?: string;
  guestName: string;
  serviceName: string;
  slotLabel: string;
  status: string;
  listingSlug?: string;
};

function rowKey(row: BookingRow, idx: number) {
  return String(row.bookingId ?? row._id ?? `${row.guestName}-${row.slotLabel}-${idx}`);
}

function badgeStyle(status: string) {
  if (status === 'pending' || status === 'requested') return styles.badgePending;
  if (status === 'confirmed') return styles.badgeConfirmed;
  if (status === 'in-salon') return styles.badgeInSalon;
  if (status === 'no-show') return styles.badgeNoShow;
  return styles.badgeDone;
}

export default function BookingsScreen() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getBusinessBookings()
      .then((items) => setRows(items as BookingRow[]))
      .catch(() => setRows([]));
  }, []);

  const counts = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          const s = row.status?.toLowerCase?.() || '';
          if (s in acc) acc[s as keyof typeof acc] += 1;
          return acc;
        },
        { pending: 0, confirmed: 0, 'in-salon': 0, 'no-show': 0 },
      ),
    [rows],
  );

  async function applyStatus(row: BookingRow, idx: number, nextStatus: BookingRow['status']) {
    const id = rowKey(row, idx);
    setBusyId(id);
    try {
      await updateBusinessBookingStatus(id, nextStatus as 'confirmed' | 'in-salon' | 'done' | 'no-show');
      setRows((prev) => prev.map((item, i) => (rowKey(item, i) === id ? { ...item, status: nextStatus } : item)));
    } catch {
      // no-op on failure
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Live bookings desk</Text>
      <Text style={styles.subtitle}>Quickly confirm, start, complete, and mark no-show from phone.</Text>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pending</Text>
          <Text style={[styles.kpiValue, { color: '#d97706' }]}>{counts.pending}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Confirmed</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{counts.confirmed}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>In service</Text>
          <Text style={[styles.kpiValue, { color: '#ea580c' }]}>{counts['in-salon']}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>No-show</Text>
          <Text style={[styles.kpiValue, { color: '#be123c' }]}>{counts['no-show']}</Text>
        </View>
      </View>

      {rows.map((item, idx) => (
        <View key={rowKey(item, idx)} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.place}>{item.guestName}</Text>
            <Text style={[styles.badge, badgeStyle(item.status)]}>{item.status}</Text>
          </View>
          <Text style={styles.service}>{item.serviceName}</Text>
          <Text style={styles.time}>{item.slotLabel}</Text>
          <View style={styles.actions}>
            {(item.status === 'pending' || item.status === 'requested') && (
              <Pressable
                style={[styles.actionBtn, styles.confirmBtn]}
                onPress={() => applyStatus(item, idx, 'confirmed')}
                disabled={busyId === rowKey(item, idx)}>
                <Text style={styles.actionBtnText}>Confirm</Text>
              </Pressable>
            )}
            {item.status === 'confirmed' && (
              <Pressable
                style={[styles.actionBtn, styles.startBtn]}
                onPress={() => applyStatus(item, idx, 'in-salon')}
                disabled={busyId === rowKey(item, idx)}>
                <Text style={styles.actionBtnText}>Start</Text>
              </Pressable>
            )}
            {item.status !== 'done' && (
              <Pressable
                style={[styles.actionBtn, styles.doneBtn]}
                onPress={() => applyStatus(item, idx, 'done')}
                disabled={busyId === rowKey(item, idx)}>
                <Text style={styles.actionBtnText}>Done</Text>
              </Pressable>
            )}
            {item.status !== 'done' && item.status !== 'no-show' && (
              <Pressable
                style={[styles.actionBtn, styles.noShowBtn]}
                onPress={() => applyStatus(item, idx, 'no-show')}
                disabled={busyId === rowKey(item, idx)}>
                <Text style={styles.actionBtnText}>No-show</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 24 },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 4, marginBottom: 14 },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  kpiCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 74,
  },
  kpiLabel: { fontSize: 10, color: AppTheme.colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  kpiValue: { marginTop: 2, fontSize: 18, fontWeight: '900' },
  card: {
    borderRadius: AppTheme.radius.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    padding: 14,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  place: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 16 },
  service: { color: AppTheme.colors.textSecondary, marginTop: 3 },
  time: { color: AppTheme.colors.brand, marginTop: 6, fontWeight: '700' },
  badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, fontSize: 10, fontWeight: '900' },
  badgePending: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeConfirmed: { backgroundColor: '#dbeafe', color: '#1e3a8a' },
  badgeInSalon: { backgroundColor: '#ffedd5', color: '#9a3412' },
  badgeNoShow: { backgroundColor: '#ffe4e6', color: '#9f1239' },
  badgeDone: { backgroundColor: '#e5e7eb', color: '#374151' },
  actions: { marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  confirmBtn: { backgroundColor: '#059669' },
  startBtn: { backgroundColor: '#ea580c' },
  doneBtn: { backgroundColor: '#374151' },
  noShowBtn: { backgroundColor: '#be123c' },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});

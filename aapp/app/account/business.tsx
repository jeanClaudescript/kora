import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { KoraCard } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { getBusinessDashboardWithContext } from '@/lib/api';

type DashboardPayload = {
  floorReality?: {
    alerts?: { id: string; severity: string; title: string; detail: string }[];
    metricsTargets?: { noShowRateTargetPct?: number; chairUtilisationPeakPct?: number };
  };
  workforceReality?: {
    hiring?: { stages?: { id: string; label: string; value: number; targetDays: number }[] };
    staffing?: {
      workerCount?: number;
      activeBookingsNow?: number;
      todayLoadPct?: number;
      noShowRatePct?: number;
      shiftAdvice?: string;
    };
  };
};

export default function BusinessMobileScreen() {
  const [dash, setDash] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    getBusinessDashboardWithContext({ vertical: 'Salon', workerCount: 8 })
      .then((data) => setDash(data as DashboardPayload))
      .catch(() => setDash(null));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Business command center</Text>
      <Text style={styles.subtitle}>Phone view of hiring, staffing load, and floor alerts.</Text>

      <KoraCard>
        <Text style={styles.blockTitle}>Staffing now</Text>
        <Text style={styles.line}>Workers: {dash?.workforceReality?.staffing?.workerCount ?? 0}</Text>
        <Text style={styles.line}>Active services: {dash?.workforceReality?.staffing?.activeBookingsNow ?? 0}</Text>
        <Text style={styles.line}>Load: {dash?.workforceReality?.staffing?.todayLoadPct ?? 0}%</Text>
        <Text style={styles.line}>No-show: {dash?.workforceReality?.staffing?.noShowRatePct ?? 0}%</Text>
        <Text style={styles.tip}>{dash?.workforceReality?.staffing?.shiftAdvice ?? 'Keep buffers protected.'}</Text>
      </KoraCard>

      <KoraCard>
        <Text style={styles.blockTitle}>Hiring pipeline</Text>
        {(dash?.workforceReality?.hiring?.stages ?? []).map((stage) => (
          <View key={stage.id} style={styles.stageRow}>
            <Text style={styles.stageLabel}>{stage.label}</Text>
            <Text style={styles.stageValue}>
              {stage.value} · {stage.targetDays}d
            </Text>
          </View>
        ))}
      </KoraCard>

      <KoraCard>
        <Text style={styles.blockTitle}>Floor alerts</Text>
        {(dash?.floorReality?.alerts ?? []).slice(0, 4).map((alert) => (
          <View key={alert.id} style={styles.alertRow}>
            <Text style={styles.alertTitle}>
              {alert.severity.toUpperCase()} · {alert.title}
            </Text>
            <Text style={styles.alertDetail}>{alert.detail}</Text>
          </View>
        ))}
        <Text style={styles.tip}>
          Target no-show {dash?.floorReality?.metricsTargets?.noShowRateTargetPct ?? 10}% · peak chair use{' '}
          {dash?.floorReality?.metricsTargets?.chairUtilisationPeakPct ?? 80}%
        </Text>
      </KoraCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  title: { color: AppTheme.colors.text, fontSize: 25, fontWeight: '900' },
  subtitle: { color: AppTheme.colors.textSecondary, marginTop: 3 },
  blockTitle: { color: AppTheme.colors.text, fontSize: 17, fontWeight: '900' },
  line: { color: AppTheme.colors.text, marginTop: 6, fontSize: 13, fontWeight: '700' },
  tip: { marginTop: 8, color: AppTheme.colors.textSecondary, fontSize: 12, lineHeight: 17 },
  stageRow: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageLabel: { color: AppTheme.colors.text, fontWeight: '700' },
  stageValue: { color: AppTheme.colors.brandDark, fontWeight: '800', fontSize: 12 },
  alertRow: { marginTop: 8, borderTopWidth: 1, borderTopColor: AppTheme.colors.line, paddingTop: 8 },
  alertTitle: { color: AppTheme.colors.text, fontWeight: '800', fontSize: 12 },
  alertDetail: { color: AppTheme.colors.textSecondary, marginTop: 3, fontSize: 12, lineHeight: 17 },
});

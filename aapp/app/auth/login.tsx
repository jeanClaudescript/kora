import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraCard, KoraInput, PrimaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { demoAuthApi, loginApi } from '@/lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function routeForRole(role: 'customer' | 'business' | 'admin') {
    if (role === 'business') return '/account/business';
    if (role === 'admin') return '/(tabs)/account';
    return '/(tabs)';
  }

  async function signIn() {
    try {
      const { user } = await loginApi({ email, password, role: 'customer' });
      router.replace(routeForRole(user.role));
    } catch {
      router.replace('/(tabs)');
    }
  }

  async function goDemo(role: 'customer' | 'business' | 'admin') {
    try {
      const { user } = await demoAuthApi(role);
      router.replace(routeForRole(user.role));
    } catch {
      router.replace(routeForRole(role));
    }
  }

  return (
    <View style={styles.container}>
      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.title}>Sign in to Kora</Text>
        <Text style={styles.sub}>Secure access to your bookings, messages, and business workspace.</Text>

        <Text style={styles.label}>Email</Text>
        <KoraInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <KoraInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <PrimaryButton label="Sign in" onPress={signIn} />

        <View style={styles.sepWrap}>
          <View style={styles.sepLine} />
          <Text style={styles.sepText}>TRY DEMO</Text>
          <View style={styles.sepLine} />
        </View>

        <View style={styles.demoRow}>
          <TouchableOpacity style={styles.demoBtn} onPress={() => goDemo('customer')}>
            <Text style={styles.demoText}>Demo guest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.demoBtn, styles.demoClient]} onPress={() => goDemo('customer')}>
            <Text style={styles.demoText}>Demo client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.demoBtn, styles.demoBusiness]} onPress={() => goDemo('business')}>
            <Text style={styles.demoText}>Demo business</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.demoBtn, styles.demoAdmin]} onPress={() => goDemo('admin')}>
          <Text style={styles.demoText}>Demo admin</Text>
        </TouchableOpacity>

        <Link href="/auth/signup" style={styles.link}>
          Don’t have an account? Create one
        </Link>
      </View>
      </KoraCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas, justifyContent: 'center', padding: 16 },
  card: { gap: 10 },
  title: { color: AppTheme.colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  sub: { color: AppTheme.colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  label: {
    color: AppTheme.colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sepWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  sepLine: { flex: 1, height: 1, backgroundColor: AppTheme.colors.line },
  sepText: { color: AppTheme.colors.muted, fontSize: 11, fontWeight: '800' },
  demoRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  demoBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevatedMuted,
    paddingVertical: 8,
    alignItems: 'center',
  },
  demoClient: { backgroundColor: '#dbeafe', borderColor: '#93c5fd' },
  demoBusiness: { backgroundColor: '#d1fae5', borderColor: '#6ee7b7' },
  demoAdmin: { backgroundColor: '#ede9fe', borderColor: '#c4b5fd', marginTop: 6 },
  demoText: { color: AppTheme.colors.text, fontSize: 12, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 8, color: AppTheme.colors.brand, fontWeight: '700' },
});

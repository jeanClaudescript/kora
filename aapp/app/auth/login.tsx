import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraCard, KoraInput, PrimaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in and continue your booking journey.</Text>

        <KoraInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
        />
        <KoraInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <PrimaryButton label="Sign in" onPress={() => router.replace('/(tabs)')} />

        <View style={styles.demoRow}>
          <TouchableOpacity style={styles.demoBtn}>
            <Text style={styles.demoText}>Demo guest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.demoBtn}>
            <Text style={styles.demoText}>Demo client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.demoBtn}>
            <Text style={styles.demoText}>Demo business</Text>
          </TouchableOpacity>
        </View>

        <Link href="/auth/signup" style={styles.link}>
          Create account
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
  demoText: { color: AppTheme.colors.text, fontSize: 12, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 8, color: AppTheme.colors.brand, fontWeight: '700' },
});

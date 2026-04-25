import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraCard, KoraInput, PrimaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { categories } from '@/data/catalog';

export default function SignupScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const startRole = useMemo(() => (role === 'business' ? 'business' : 'customer'), [role]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredCity, setPreferredCity] = useState('Kigali');
  const [userRole, setUserRole] = useState<'customer' | 'business'>(startRole);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.sub}>Join as a customer or business owner.</Text>

        <KoraInput value={name} onChangeText={setName} placeholder="Full name" />
        <KoraInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
        />
        <KoraInput value={preferredCity} onChangeText={setPreferredCity} placeholder="Kigali" />
        <KoraInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

        <View style={styles.roleWrap}>
          <TouchableOpacity
            style={[styles.roleBtn, userRole === 'customer' && styles.roleBtnActive]}
            onPress={() => setUserRole('customer')}>
            <Text style={[styles.roleText, userRole === 'customer' && styles.roleTextActive]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, userRole === 'business' && styles.roleBtnActive]}
            onPress={() => setUserRole('business')}>
            <Text style={[styles.roleText, userRole === 'business' && styles.roleTextActive]}>Business</Text>
          </TouchableOpacity>
        </View>

        {userRole === 'business' ? (
          <View style={styles.businessBox}>
            <Text style={styles.businessLabel}>Business category</Text>
            <Text style={styles.businessValue}>{categories[1]?.icon} {categories[1]?.label}</Text>
          </View>
        ) : null}

        <PrimaryButton label="Create account" onPress={() => router.replace('/(tabs)')} />
        <Link href="/auth/login" style={styles.link}>
          Already have account? Sign in
        </Link>
      </View>
      </KoraCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas },
  content: { padding: 16, paddingBottom: 40 },
  card: { gap: 10 },
  title: { color: AppTheme.colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  sub: { color: AppTheme.colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  roleWrap: { flexDirection: 'row', gap: 8, marginTop: 4 },
  roleBtn: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: AppTheme.colors.lineStrong, backgroundColor: AppTheme.colors.elevatedMuted, paddingVertical: 10, alignItems: 'center' },
  roleBtnActive: { backgroundColor: AppTheme.colors.brand, borderColor: AppTheme.colors.brand },
  roleText: { color: AppTheme.colors.text, fontWeight: '700' },
  roleTextActive: { color: '#fff' },
  businessBox: { borderWidth: 1, borderColor: AppTheme.colors.line, borderRadius: 12, backgroundColor: AppTheme.colors.elevatedMuted, padding: 12 },
  businessLabel: { color: AppTheme.colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  businessValue: { color: AppTheme.colors.text, marginTop: 3, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 6, color: AppTheme.colors.brand, fontWeight: '700' },
});

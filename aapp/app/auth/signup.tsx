import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraCard, KoraInput, PrimaryButton } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';
import { categories } from '@/data/catalog';
import { signupApi } from '@/lib/api';

export default function SignupScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const startRole = useMemo(() => (role === 'business' ? 'business' : 'customer'), [role]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredCity, setPreferredCity] = useState('Kigali');
  const [userRole, setUserRole] = useState<'customer' | 'business'>(startRole);
  const [businessCategory, setBusinessCategory] = useState('Salon');
  const [workerCount, setWorkerCount] = useState(10);

  async function submit() {
    try {
      const { user } = await signupApi({
        name: name.trim() || 'New user',
        email: email.trim() || 'user@kora.app',
        password,
        role: userRole,
        preferredCity: preferredCity.trim() || 'Kigali',
        businessCategory: userRole === 'business' ? businessCategory : undefined,
        businessWorkerCount: userRole === 'business' ? workerCount : undefined,
      });
      router.replace(user.role === 'business' ? '/account/business' : '/(tabs)');
    } catch {
      router.replace(userRole === 'business' ? '/account/business' : '/(tabs)');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <KoraCard>
      <View style={styles.card}>
        <Text style={styles.title}>Create your Kora account</Text>
        <Text style={styles.sub}>Join as customer or business owner and personalize your booking experience.</Text>

        <Text style={styles.label}>Full name</Text>
        <KoraInput value={name} onChangeText={setName} placeholder="Full name" />
        <Text style={styles.label}>Email</Text>
        <KoraInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Preferred city</Text>
        <KoraInput value={preferredCity} onChangeText={setPreferredCity} placeholder="Kigali" />
        <Text style={styles.label}>Password</Text>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {categories
                .filter((c) => c.id !== 'all')
                .map((c) => {
                  const active = businessCategory === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setBusinessCategory(c.id)}
                      style={[styles.catChip, active && styles.catChipActive]}>
                      <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                        {c.icon} {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <Text style={[styles.businessLabel, { marginTop: 10 }]}>Team size (up to 100)</Text>
            <View style={styles.workerRow}>
              <TouchableOpacity
                style={styles.workerAdjustBtn}
                onPress={() => setWorkerCount((n) => Math.max(1, n - 1))}>
                <Text style={styles.workerAdjustText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.businessValue}>{workerCount} workers</Text>
              <TouchableOpacity
                style={styles.workerAdjustBtn}
                onPress={() => setWorkerCount((n) => Math.min(100, n + 1))}>
                <Text style={styles.workerAdjustText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <PrimaryButton label="Create account" onPress={submit} />
        <Link href="/auth/login" style={styles.link}>
          Already have an account? Sign in
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
  label: {
    color: AppTheme.colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleWrap: { flexDirection: 'row', gap: 8, marginTop: 4 },
  roleBtn: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: AppTheme.colors.lineStrong, backgroundColor: AppTheme.colors.elevatedMuted, paddingVertical: 10, alignItems: 'center' },
  roleBtnActive: { backgroundColor: AppTheme.colors.brand, borderColor: AppTheme.colors.brand },
  roleText: { color: AppTheme.colors.text, fontWeight: '700' },
  roleTextActive: { color: '#fff' },
  businessBox: { borderWidth: 1, borderColor: AppTheme.colors.line, borderRadius: 12, backgroundColor: AppTheme.colors.elevatedMuted, padding: 12 },
  businessLabel: { color: AppTheme.colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  businessValue: { color: AppTheme.colors.text, marginTop: 3, fontWeight: '700' },
  catRow: { gap: 8, paddingTop: 8, paddingBottom: 2 },
  catChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  catChipActive: {
    borderColor: AppTheme.colors.brand,
    backgroundColor: AppTheme.colors.brandSoft,
  },
  catChipText: { color: AppTheme.colors.text, fontSize: 12, fontWeight: '700' },
  catChipTextActive: { color: AppTheme.colors.brandDark },
  workerRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  workerAdjustBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerAdjustText: { color: AppTheme.colors.text, fontSize: 18, fontWeight: '900' },
  link: { textAlign: 'center', marginTop: 6, color: AppTheme.colors.brand, fontWeight: '700' },
});

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '@/constants/app-theme';

export function ClientMobileHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAccountOpen, setMenuAccountOpen] = useState(false);
  const [menuNotifOpen, setMenuNotifOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'FR' | 'RW'>('EN');
  const [darkHeader, setDarkHeader] = useState(true);

  const palette = useMemo(
    () =>
      darkHeader
        ? {
            shell: 'rgba(3, 7, 18, 0.12)',
            shellSoft: 'rgba(2, 6, 23, 0.16)',
            card: 'rgba(15, 23, 42, 0.28)',
            border: 'rgba(148, 163, 184, 0.20)',
            text: '#e5e7eb',
            textSoft: '#9ca3af',
            icon: '#d1d5db',
            k: '#2563eb',
          }
        : {
            shell: 'rgba(243, 244, 246, 0.20)',
            shellSoft: 'rgba(248, 250, 252, 0.25)',
            card: 'rgba(255, 255, 255, 0.42)',
            border: 'rgba(148, 163, 184, 0.20)',
            text: '#111827',
            textSoft: '#6b7280',
            icon: '#4b5563',
            k: '#2f65d9',
          },
    [darkHeader],
  );

  function submitSearch() {
    router.push({ pathname: '/(tabs)/search', params: query ? { q: query } : {} });
    setMenuOpen(false);
    setLanguageOpen(false);
  }

  function navigate(to: string) {
    router.push(to as never);
    setMenuOpen(false);
    setMenuAccountOpen(false);
    setMenuNotifOpen(false);
    setLanguageOpen(false);
  }

  const hasOverlay = menuOpen || menuAccountOpen || menuNotifOpen;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: palette.shell }]}>
      {hasOverlay ? (
        <Pressable
          style={styles.dismiss}
          onPress={() => {
            setMenuOpen(false);
            setMenuAccountOpen(false);
            setMenuNotifOpen(false);
            setLanguageOpen(false);
          }}
        />
      ) : null}
      <View style={[styles.wrap, { backgroundColor: palette.shellSoft, borderBottomColor: palette.border }]}>
        <View style={styles.rowTop}>
          <TouchableOpacity
            style={[styles.squareBtn, { borderColor: palette.border, backgroundColor: palette.card }]}
            onPress={() => {
              setMenuOpen((v) => !v);
              setMenuAccountOpen(false);
              setMenuNotifOpen(false);
            }}>
            <Feather name="menu" size={20} color={palette.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.kLogo, { backgroundColor: palette.k }]} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.kLogoText}>K</Text>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={[styles.circleBtn, { borderColor: palette.border, backgroundColor: palette.card }]}
              onPress={() => setDarkHeader((v) => !v)}>
              <Feather name={darkHeader ? 'sun' : 'moon'} size={18} color={darkHeader ? '#f59e0b' : '#d39a2f'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, { borderColor: palette.border, backgroundColor: palette.card }]}
              onPress={() => router.push('/(tabs)/search')}>
              <Ionicons name="search" size={18} color={palette.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, { borderColor: palette.border, backgroundColor: palette.card }]}
              onPress={() => {
                setMenuNotifOpen((v) => !v);
                setMenuAccountOpen(false);
                setMenuOpen(false);
              }}>
              <Ionicons name="notifications-outline" size={18} color={palette.icon} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, styles.avatarBtn, { borderColor: '#2563EB', backgroundColor: '#1d4ed8' }]}
              onPress={() => {
                setMenuAccountOpen((v) => !v);
                setMenuNotifOpen(false);
                setMenuOpen(false);
              }}>
              <Text style={styles.avatarText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchShell, { borderColor: palette.border, backgroundColor: palette.card }]}>
          <MaterialCommunityIcons name="magnify" size={22} color="#4f78c2" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submitSearch}
            placeholder="What do you need?"
            placeholderTextColor={AppTheme.colors.placeholder}
          />
        </View>

        {menuOpen ? (
          <View style={[styles.dropdownCard, { backgroundColor: 'rgba(2, 6, 23, 0.38)', borderColor: 'rgba(96, 165, 250, 0.35)' }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/(tabs)/search')}>
              <Text style={[styles.menuText, { color: '#f3f4f6' }]}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push({ pathname: '/(tabs)/search', params: { category: 'Salon' } })}>
              <Text style={[styles.menuText, { color: '#f3f4f6' }]}>Salon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push({ pathname: '/(tabs)/search', params: { category: 'Barber' } })}>
              <Text style={[styles.menuText, { color: '#f3f4f6' }]}>Barber</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/auth/signup')}>
              <Text style={[styles.menuText, { color: '#f3f4f6' }]}>For business</Text>
            </TouchableOpacity>
            <Text style={styles.menuLabel}>LANGUAGE</Text>
            <TouchableOpacity style={styles.languageHead} onPress={() => setLanguageOpen((v) => !v)}>
              <Text style={styles.menuLanguage}>{language}</Text>
              <Feather name={languageOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#d1d5db" />
            </TouchableOpacity>
            {languageOpen ? (
              <View style={styles.languageOptions}>
                {(['EN', 'FR', 'RW'] as const).map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[styles.languageOption, language === code && styles.languageOptionActive]}
                    onPress={() => {
                      setLanguage(code);
                      setLanguageOpen(false);
                    }}>
                    <Text style={[styles.languageOptionText, language === code && styles.languageOptionTextActive]}>
                      {code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {menuAccountOpen ? (
          <View style={[styles.accountCard, { backgroundColor: '#0b1736', borderColor: '#2f4b8a' }]}>
            <Text style={styles.accountEmail}>aline@demo.kora</Text>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/account/messages')}>
              <Text style={styles.accountText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/account/trips')}>
              <Text style={styles.accountText}>My bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/(tabs)/account')}>
              <Text style={styles.accountText}>Account settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.accountRow, styles.signOutRow]} onPress={() => navigate('/auth/login')}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {menuNotifOpen ? (
          <View style={[styles.notifCard, { backgroundColor: '#0b1736', borderColor: '#2f4b8a' }]}>
            <Text style={styles.notifTitle}>Notifications</Text>
            <Text style={styles.notifItem}>Booking confirmed: Amahoro Glow Salon · 10:30</Text>
            <Text style={styles.notifItem}>Reminder: appointment starts in 30 minutes</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: 'transparent',
    zIndex: 80,
  },
  dismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1200,
    backgroundColor: 'transparent',
  },
  wrap: {
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 10,
  },
  rowTop: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  squareBtn: {
    width: 48,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  kLogo: {
    marginLeft: 8,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2f65d9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  kLogoText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  rightIcons: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: -1,
    minWidth: 17,
    height: 17,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  searchShell: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#f3f4f6',
    fontSize: 16,
  },
  avatarBtn: { borderWidth: 2 },
  avatarText: { color: '#dbeafe', fontWeight: '900', fontSize: 16 },
  dropdownCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    gap: 3,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 4 },
  menuText: { fontSize: 32 / 2, fontWeight: '700' },
  menuLabel: { marginTop: 6, color: '#9ca3af', fontSize: 12, fontWeight: '800' },
  menuLanguage: { color: '#f3f4f6', fontSize: 30 / 2, fontWeight: '800', paddingVertical: 6 },
  languageHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  languageOptions: { flexDirection: 'row', gap: 8, paddingBottom: 6 },
  languageOption: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(30,41,59,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  languageOptionActive: { borderColor: '#60a5fa', backgroundColor: 'rgba(37,99,235,0.45)' },
  languageOptionText: { color: '#cbd5e1', fontWeight: '700', fontSize: 12 },
  languageOptionTextActive: { color: '#fff' },
  accountCard: {
    position: 'absolute',
    right: 10,
    top: 98,
    width: 230,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 50,
  },
  accountEmail: { color: '#9fb2e5', fontSize: 13, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  accountRow: { paddingHorizontal: 14, paddingVertical: 10 },
  accountText: { color: '#e5e7eb', fontSize: 20 / 2, fontWeight: '700' },
  signOutRow: { borderTopWidth: 1, borderTopColor: '#1f3e78' },
  signOutText: { color: '#fb7185', fontSize: 20 / 2, fontWeight: '800' },
  notifCard: {
    position: 'absolute',
    right: 62,
    top: 98,
    width: 260,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    zIndex: 50,
    gap: 8,
  },
  notifTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: '800' },
  notifItem: { color: '#cbd5e1', fontSize: 12, lineHeight: 17 },
});

import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeMode } from '@/providers/theme-mode-provider';

export function ClientMobileHeader() {
  const router = useRouter();
  const { mode, setMode, theme } = useThemeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAccountOpen, setMenuAccountOpen] = useState(false);
  const [menuNotifOpen, setMenuNotifOpen] = useState(false);
  const [query, setQuery] = useState('');

  function navigate(to: string) {
    router.push(to as never);
    setMenuOpen(false);
    setMenuAccountOpen(false);
    setMenuNotifOpen(false);
  }

  function toggleThemeQuick() {
    setMode((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  }

  function submitSearch() {
    navigate('/(tabs)/search');
  }

  const hasOverlay = menuOpen || menuAccountOpen || menuNotifOpen;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.colors.headerSurface }]}>
      {hasOverlay ? (
        <Pressable
          style={styles.dismiss}
          onPress={() => {
            setMenuOpen(false);
            setMenuAccountOpen(false);
            setMenuNotifOpen(false);
          }}
        />
      ) : null}
      <View
        style={[
          styles.wrap,
          {
            backgroundColor: theme.colors.headerSurface,
            borderBottomColor: theme.colors.navBorder,
          },
        ]}>
        <View style={styles.titleTopRow}>
          <Text style={[styles.appNameTop, { color: theme.colors.textSecondary }]}>Kora App</Text>
        </View>
        <View style={styles.rowTop}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { borderColor: theme.colors.navBorder, backgroundColor: theme.colors.elevatedMuted },
            ]}
            onPress={() => {
              setMenuOpen((v) => !v);
              setMenuAccountOpen(false);
              setMenuNotifOpen(false);
            }}>
            <Feather name={menuOpen ? 'x' : 'menu'} size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.brandBlock} onPress={() => router.push('/(tabs)')}>
            <View style={[styles.logo, { backgroundColor: theme.colors.brandDark }]}>
              <Text style={styles.logoText}>K</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { borderColor: theme.colors.navBorder, backgroundColor: theme.colors.elevatedMuted },
              ]}
              onPress={toggleThemeQuick}
              accessibilityLabel="Toggle theme"
            >
              <Ionicons name="moon-outline" size={18} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { borderColor: theme.colors.navBorder, backgroundColor: theme.colors.elevatedMuted },
              ]}
              onPress={submitSearch}
              accessibilityLabel="Search"
            >
              <Ionicons name="search" size={18} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { borderColor: theme.colors.navBorder, backgroundColor: theme.colors.elevatedMuted },
              ]}
              onPress={() => {
                setMenuNotifOpen((v) => !v);
                setMenuAccountOpen(false);
                setMenuOpen(false);
              }}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={18} color={theme.colors.text} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.avatarBtn,
                { borderColor: theme.colors.brand, backgroundColor: theme.colors.brandDark },
              ]}
              onPress={() => {
                setMenuAccountOpen((v) => !v);
                setMenuNotifOpen(false);
                setMenuOpen(false);
              }}
              accessibilityLabel="Account"
            >
              <Text style={styles.avatarText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchShell,
              {
                borderColor: theme.colors.navBorder,
                backgroundColor: theme.colors.elevated,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={theme.colors.brand} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ukeneye iki?"
              placeholderTextColor={theme.colors.placeholder}
              style={[styles.searchInput, { color: theme.colors.text }]}
              returnKeyType="search"
              onSubmitEditing={submitSearch}
            />
          </View>
        </View>

        {menuOpen ? (
          <View style={[styles.dropdownCard, { backgroundColor: theme.colors.elevated, borderColor: theme.colors.navBorder }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/(tabs)')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/(tabs)/search')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/(tabs)/bookings')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/(tabs)/account')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Account</Text>
            </TouchableOpacity>
            <Text style={[styles.menuLabel, { color: theme.colors.brand }]}>THEME</Text>
            <View style={styles.themeRow}>
              {(['system', 'light', 'dark'] as const).map((k) => {
                const active = mode === k;
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => setMode(k)}
                    style={[
                      styles.themePill,
                      {
                        borderColor: active ? theme.colors.brand : theme.colors.navBorder,
                        backgroundColor: active ? theme.colors.brandSoft : theme.colors.elevatedMuted,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.themePillText,
                        { color: active ? theme.colors.brand : theme.colors.textSecondary },
                      ]}>
                      {k.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.brand }]}>BUSINESS</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/account/business')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>Business</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/auth/signup')}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>For business signup</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {menuAccountOpen ? (
          <View style={[styles.accountCard, { backgroundColor: theme.colors.elevated, borderColor: theme.colors.navBorder }]}>
            <Text style={[styles.accountEmail, { color: theme.colors.brand }]}>aline@demo.kora</Text>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/account/messages')}>
              <Text style={[styles.accountText, { color: theme.colors.text }]}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/account/trips')}>
              <Text style={[styles.accountText, { color: theme.colors.text }]}>My bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountRow} onPress={() => navigate('/(tabs)/account')}>
              <Text style={[styles.accountText, { color: theme.colors.text }]}>Account settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.accountRow, styles.signOutRow]} onPress={() => navigate('/auth/login')}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {menuNotifOpen ? (
          <View style={[styles.notifCard, { backgroundColor: theme.colors.elevated, borderColor: theme.colors.navBorder }]}>
            <Text style={[styles.notifTitle, { color: theme.colors.text }]}>Activity</Text>
            <Text style={[styles.notifItem, { color: theme.colors.textSecondary }]}>
              Booking confirmed: Amahoro Glow Salon · 10:30
            </Text>
            <Text style={[styles.notifItem, { color: theme.colors.textSecondary }]}>
              Reminder: appointment starts in 30 minutes
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
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
  },
  titleTopRow: {
    paddingTop: 4,
    paddingBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameTop: { fontSize: 12, fontWeight: '900', letterSpacing: 0.4 },
  brandBlock: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTop: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 48,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  rightIcons: { marginLeft: 'auto', flexDirection: 'row', gap: 10 },
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
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  avatarText: { color: '#dbeafe', fontWeight: '900', fontSize: 16 },
  searchRow: { paddingTop: 8 },
  searchShell: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  dropdownCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    gap: 3,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 4 },
  menuText: { fontSize: 16, fontWeight: '700' },
  menuLabel: { marginTop: 6, fontSize: 12, fontWeight: '800' },
  themeRow: { flexDirection: 'row', gap: 8, paddingTop: 6, paddingBottom: 4 },
  themePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  themePillText: { fontWeight: '900', fontSize: 11, letterSpacing: 0.6 },
  accountCard: {
    position: 'absolute',
    right: 10,
    top: 58,
    width: 230,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 50,
  },
  accountEmail: { fontSize: 13, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, fontWeight: '800' },
  accountRow: { paddingHorizontal: 14, paddingVertical: 10 },
  accountText: { fontSize: 14, fontWeight: '700' },
  signOutRow: { borderTopWidth: 1, borderTopColor: 'rgba(148,163,184,0.25)' },
  signOutText: { color: '#fb7185', fontSize: 20 / 2, fontWeight: '800' },
  notifCard: {
    position: 'absolute',
    right: 62,
    top: 58,
    width: 260,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    zIndex: 50,
    gap: 8,
  },
  notifTitle: { fontSize: 13, fontWeight: '800' },
  notifItem: { fontSize: 12, lineHeight: 17 },
});

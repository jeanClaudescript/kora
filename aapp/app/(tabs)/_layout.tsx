import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { ClientMobileBottomNav } from '@/components/layout/client-mobile-bottom-nav';
import { ClientMobileHeader } from '@/components/layout/client-mobile-header';
import { HapticTab } from '@/components/haptic-tab';
import { AppTheme } from '@/constants/app-theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <ClientMobileBottomNav {...props} />}
      screenOptions={{
        header: () => <ClientMobileHeader />,
        headerTransparent: true,
        headerShadowVisible: false,
        sceneStyle: {
          paddingTop: 116,
          backgroundColor: 'transparent',
        },
        tabBarActiveTintColor: AppTheme.colors.brand,
        tabBarInactiveTintColor: AppTheme.colors.muted,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <MaterialIcons size={22} name="book-online" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome6 size={20} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

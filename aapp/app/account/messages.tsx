import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { KoraInput } from '@/components/ui/primitives';
import { AppTheme } from '@/constants/app-theme';

const threads = [
  { id: '1', biz: 'Amahoro Glow Salon', last: 'We moved you to 11:15 ✓', time: '10:12' },
  { id: '2', biz: 'Kigali Cuts', last: 'See you Friday!', time: 'Yesterday' },
];

export default function AccountMessagesScreen() {
  const [active, setActive] = useState(threads[0].id);
  const current = threads.find((thread) => thread.id === active) ?? threads[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.sub}>Stay synced with businesses across app and WhatsApp follow-up.</Text>
      <View style={styles.shell}>
        <ScrollView style={styles.sidebar}>
          {threads.map((thread) => {
            const isActive = active === thread.id;
            return (
              <TouchableOpacity
                key={thread.id}
                style={[styles.thread, isActive && styles.threadActive]}
                onPress={() => setActive(thread.id)}>
                <Text style={styles.threadBiz}>{thread.biz}</Text>
                <Text numberOfLines={1} style={styles.threadLast}>{thread.last}</Text>
                <Text style={styles.threadTime}>{thread.time}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.chatPane}>
          <Text style={styles.chatHeader}>{current.biz}</Text>
          <View style={styles.messages}>
            <View style={styles.bizBubble}>
              <Text style={styles.bizText}>Hello! Your preferred barber is free at 11:15. Want us to lock it?</Text>
            </View>
            <View style={styles.userBubble}>
              <Text style={styles.userText}>Yes please, confirm 11:15 and I will arrive 10 min early.</Text>
            </View>
          </View>
          <KoraInput placeholder="Type a message..." style={styles.input} />
        </View>
      </View>
      <Text style={styles.footerNote}>One thread for app and WhatsApp confirmations.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.canvas, padding: 16, paddingBottom: 90 },
  title: { color: AppTheme.colors.text, fontSize: 24, fontWeight: '900' },
  sub: { color: AppTheme.colors.textSecondary, marginTop: 2, marginBottom: 8 },
  shell: { flex: 1, borderRadius: 18, borderWidth: 1, borderColor: AppTheme.colors.line, backgroundColor: AppTheme.colors.elevated, overflow: 'hidden' },
  sidebar: { maxHeight: 200, borderBottomWidth: 1, borderBottomColor: AppTheme.colors.line },
  thread: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: AppTheme.colors.line },
  threadActive: { backgroundColor: '#eff6ff' },
  threadBiz: { color: AppTheme.colors.text, fontWeight: '800' },
  threadLast: { color: AppTheme.colors.textSecondary, fontSize: 12, marginTop: 1 },
  threadTime: { color: AppTheme.colors.muted, fontSize: 11, marginTop: 2 },
  chatPane: { flex: 1 },
  chatHeader: { color: AppTheme.colors.text, fontWeight: '800', padding: 12, borderBottomWidth: 1, borderBottomColor: AppTheme.colors.line },
  messages: { flex: 1, padding: 12, gap: 8, backgroundColor: '#f8fafc' },
  bizBubble: { alignSelf: 'flex-start', borderRadius: 14, backgroundColor: AppTheme.colors.elevated, borderWidth: 1, borderColor: AppTheme.colors.line, paddingHorizontal: 10, paddingVertical: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', borderRadius: 14, backgroundColor: AppTheme.colors.brand, paddingHorizontal: 10, paddingVertical: 8, maxWidth: '85%' },
  bizText: { color: AppTheme.colors.text, fontSize: 13 },
  userText: { color: '#fff', fontSize: 13 },
  input: { borderTopWidth: 1, borderTopColor: AppTheme.colors.line, borderRadius: 0, backgroundColor: AppTheme.colors.elevated },
  footerNote: { marginTop: 10, textAlign: 'center', color: AppTheme.colors.muted, fontSize: 11, fontWeight: '600' },
});

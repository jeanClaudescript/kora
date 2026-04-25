import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export function KoraCard({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.colors.line, backgroundColor: theme.colors.elevated },
      ]}>
      {children}
    </View>
  );
}

export function KoraInput(props: React.ComponentProps<typeof TextInput>) {
  const theme = useAppTheme();
  return (
    <TextInput
      placeholderTextColor={theme.colors.placeholder}
      {...props}
      style={[
        styles.input,
        {
          borderColor: theme.colors.lineStrong,
          backgroundColor: theme.colors.elevatedMuted,
          color: theme.colors.text,
        },
        props.style,
      ]}
    />
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, { backgroundColor: theme.colors.brand }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.secondaryBtn,
        { borderColor: theme.colors.lineStrong, backgroundColor: theme.colors.elevatedMuted },
      ]}
      onPress={onPress}>
      <Text style={[styles.secondaryBtnText, { color: theme.colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PillChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          borderColor: theme.colors.lineStrong,
          backgroundColor: theme.colors.elevated,
        },
        active && {
          borderColor: theme.colors.brand,
          backgroundColor: theme.colors.brand,
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.chipText, { color: theme.colors.text }, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.card,
    borderWidth: 1,
    padding: AppTheme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryBtn: {
    borderRadius: AppTheme.radius.input,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
  },
  secondaryBtn: {
    borderRadius: AppTheme.radius.input,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontWeight: '700',
  },
  chip: {
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: AppTheme.typography.caption,
    fontWeight: '700',
  },
  chipTextActive: {
    color: AppTheme.colors.white,
  },
  disabled: {
    opacity: 0.45,
  },
});

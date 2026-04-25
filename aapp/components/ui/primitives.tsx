import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function KoraCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function KoraInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={AppTheme.colors.placeholder}
      {...props}
      style={[styles.input, props.style]}
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
  return (
    <TouchableOpacity style={[styles.primaryBtn, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
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
  return (
    <TouchableOpacity style={styles.secondaryBtn} onPress={onPress}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
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
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.line,
    backgroundColor: AppTheme.colors.elevated,
    padding: AppTheme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    borderRadius: AppTheme.radius.input,
    backgroundColor: AppTheme.colors.elevatedMuted,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: AppTheme.colors.text,
  },
  primaryBtn: {
    borderRadius: AppTheme.radius.input,
    backgroundColor: AppTheme.colors.brand,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
  },
  secondaryBtn: {
    borderRadius: AppTheme.radius.input,
    borderColor: AppTheme.colors.lineStrong,
    borderWidth: 1,
    backgroundColor: AppTheme.colors.elevatedMuted,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  chip: {
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    borderColor: AppTheme.colors.lineStrong,
    backgroundColor: AppTheme.colors.elevated,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipActive: {
    borderColor: AppTheme.colors.brand,
    backgroundColor: AppTheme.colors.brand,
  },
  chipText: {
    color: AppTheme.colors.text,
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

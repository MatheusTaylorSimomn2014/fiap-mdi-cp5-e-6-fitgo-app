import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

/**
 * Botão padrão do FitGo (Poppins-like, cantos arredondados, paleta terrosa).
 */
export function FitGoButton({ label, onPress, variant = 'primary', disabled, style }: Props) {
  const theme = useTheme();

  const bg =
    variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.backgroundSelected : 'transparent';
  const fg = variant === 'primary' ? theme.onPrimary : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
        variant === 'ghost' && styles.ghostBorder,
        variant === 'ghost' && { borderColor: theme.border },
        style,
      ]}>
      <ThemedText type="smallBold" style={{ color: fg }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

/**
 * Card com fundo elevado e sombra suave, usado em treinos, métricas e perfil.
 */
export function FitGoCard({ children, style, onPress }: CardProps) {
  const theme = useTheme();

  const content = (
    <ThemedView
      type="card"
      style={[
        styles.card,
        {
          borderColor: theme.border,
          shadowColor: theme.text,
        },
        style,
      ]}>
      {children}
    </ThemedView>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

/**
 * Badge/pílula para nível, objetivo e tags.
 */
export function Pill({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'warning' }) {
  const theme = useTheme();
  const bg =
    tone === 'success' ? theme.success : tone === 'warning' ? theme.danger : theme.accent;
  const isLightTone = tone === 'default';

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <ThemedText type="smallBold" style={{ color: isLightTone ? theme.onPrimary : theme.background, fontSize: 11 }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBorder: {
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
});

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitGoCard, Pill } from '@/components/fitgo-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { NIVEL_LABEL, Nivel, WORKOUTS } from '@/constants/mockData';
import { useTheme } from '@/hooks/use-theme';

const FILTROS: (Nivel | 'todos')[] = ['todos', 'iniciante', 'intermediario', 'avancado'];

export default function TreinosScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [nivel, setNivel] = useState<Nivel | 'todos'>('todos');

  const lista = useMemo(
    () => (nivel === 'todos' ? WORKOUTS : WORKOUTS.filter((w) => w.nivel === nivel)),
    [nivel],
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.three, paddingBottom: BottomTabInset + Spacing.five },
        ]}>
        <ThemedText type="subtitle">Treinos</ThemedText>
        <ThemedText themeColor="textSecondary">
          Escolha um treino de acordo com seu nível e objetivo.
        </ThemedText>

        {/* Filtros por nível */}
        <View style={styles.filters}>
          {FILTROS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setNivel(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: f === nivel ? theme.primary : theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={{ color: f === nivel ? theme.onPrimary : theme.textSecondary }}>
                {f === 'todos' ? 'Todos' : NIVEL_LABEL[f]}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {lista.map((w) => (
          <FitGoCard key={w.id} onPress={() => router.push(`/${w.id}` as any)}>
            <View style={styles.workoutHeader}>
              <View style={[styles.emojiBox, { backgroundColor: theme.accent }]}>
                <ThemedText style={styles.emoji}>{w.emoji}</ThemedText>
              </View>
              <View style={styles.workoutInfo}>
                <ThemedText type="smallBold">{w.nome}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                  {w.descricao}
                </ThemedText>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Pill label={NIVEL_LABEL[w.nivel]} />
              <ThemedText type="small" themeColor="textSecondary">
                ⏱ {w.duracaoMin} min · 🔥 ~{w.caloriasEstimadas} kcal · {w.exercicios.length} exercícios
              </ThemedText>
            </View>
          </FitGoCard>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  workoutHeader: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  workoutInfo: { flex: 1, gap: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flexWrap: 'wrap' },
});

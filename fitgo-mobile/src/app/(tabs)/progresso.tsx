import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitGoCard, Pill } from '@/components/fitgo-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { ACHIEVEMENTS, WEIGHT_HISTORY, WEEKLY_STATS, getWorkoutById } from '@/constants/mockData';
import { WorkoutSession, computeStreak, loadSessions } from '@/services/storage';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tela de Progresso: gráfico simples de peso (barras), estatísticas semanais,
 * streak calculado a partir das sessões salvas e lista de conquistas.
 */
export default function ProgressoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    loadSessions().then(setSessions);
  }, []);

  const streak = useMemo(() => computeStreak(sessions), [sessions]);
  const totalMinutos = useMemo(() => sessions.reduce((acc, s) => acc + s.duracaoMin, 0), [sessions]);
  const totalCalorias = useMemo(() => sessions.reduce((acc, s) => acc + s.calorias, 0), [sessions]);

  const pesos = WEIGHT_HISTORY.map((p) => p.pesoKg);
  const minPeso = Math.min(...pesos);
  const maxPeso = Math.max(...pesos);
  const variacao = (pesos[pesos.length - 1] - pesos[0]).toFixed(1);

  const maxStats = Math.max(...WEEKLY_STATS.map((w) => w.treinosConcluidas), 1);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.three, paddingBottom: BottomTabInset + Spacing.five },
        ]}>
        <ThemedText type="subtitle">Progresso</ThemedText>

        {/* Resumo desta semana (sessões reais + base mockada) */}
        <View style={styles.statsRow}>
          <FitGoCard style={styles.statCard}>
            <ThemedText type="title" style={[styles.statNumber, { color: theme.primary }]}>
              {streak}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              🔥 dias de streak
            </ThemedText>
          </FitGoCard>
          <FitGoCard style={styles.statCard}>
            <ThemedText type="title" style={[styles.statNumber, { color: theme.primary }]}>
              {sessions.length}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              🏋️ treinos registrados
            </ThemedText>
          </FitGoCard>
          <FitGoCard style={styles.statCard}>
            <ThemedText type="title" style={[styles.statNumber, { color: theme.primary }]}>
              {totalMinutos}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              ⏱ minutos ativos
            </ThemedText>
          </FitGoCard>
        </View>

        {totalCalorias > 0 && (
          <ThemedText type="small" themeColor="success">
            Você já queimou ~{totalCalorias} kcal com o FitGo!
          </ThemedText>
        )}

        {/* Gráfico de peso (mock) */}
        <FitGoCard>
          <View style={styles.cardHeader}>
            <ThemedText type="smallBold">Evolução do peso</ThemedText>
            <Pill label={`${variacao} kg em 8 semanas`} tone="success" />
          </View>
          <View style={styles.barChart}>
            {WEIGHT_HISTORY.map((p) => {
              const ratio = (p.pesoKg - minPeso) / (maxPeso - minPeso || 1);
              return (
                <View key={p.label} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      { height: 40 + ratio * 60, backgroundColor: theme.primary },
                    ]}
                  />
                  <ThemedText type="small" themeColor="textSecondary" style={styles.barLabel}>
                    {p.label.replace('Sem ', 'S')}
                  </ThemedText>
                  <ThemedText type="small" style={styles.barValue}>
                    {p.pesoKg}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </FitGoCard>

        {/* Estatísticas semanais (mock) */}
        <FitGoCard>
          <ThemedText type="smallBold">Últimas semanas</ThemedText>
          {WEEKLY_STATS.map((w) => (
            <View key={w.semanaLabel} style={styles.weekRow}>
              <ThemedText type="small" style={styles.weekLabel}>
                {w.semanaLabel}
              </ThemedText>
              <View style={[styles.weekBarTrack, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    styles.weekBarFill,
                    {
                      width: `${(w.treinosConcluidas / maxStats) * 100}%`,
                      backgroundColor: theme.accent,
                    },
                  ]}
                />
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.weekMeta}>
                {w.treinosConcluidas} treinos · {(w.cargaTotalKg / 1000).toFixed(1)}t
              </ThemedText>
            </View>
          ))}
        </FitGoCard>

        {/* Conquistas (mock) */}
        <FitGoCard>
          <ThemedText type="smallBold">Conquistas</ThemedText>
          <View style={styles.achievements}>
            {ACHIEVEMENTS.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.achievement,
                  {
                    backgroundColor: a.desbloqueada ? theme.backgroundSelected : theme.backgroundElement,
                    opacity: a.desbloqueada ? 1 : 0.5,
                  },
                ]}>
                <ThemedText style={styles.achievementIcon}>{a.icone}</ThemedText>
                <ThemedText type="smallBold" style={styles.achievementTitle}>
                  {a.titulo}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {a.descricao}
                </ThemedText>
              </View>
            ))}
          </View>
        </FitGoCard>

        {/* Histórico recente de sessões reais */}
        {sessions.length > 0 && (
          <FitGoCard>
            <ThemedText type="smallBold">Histórico recente</ThemedText>
            {sessions
              .slice(-5)
              .reverse()
              .map((s, i) => {
                const w = getWorkoutById(s.workoutId);
                return (
                  <ThemedText key={i} type="small" themeColor="textSecondary">
                    {new Date(s.dataISO).toLocaleDateString('pt-BR')} — {w?.nome ?? s.workoutId} ·{' '}
                    {s.duracaoMin} min
                  </ThemedText>
                );
              })}
          </FitGoCard>
        )}
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
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, lineHeight: 34 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, justifyContent: 'space-between' },
  barColumn: { flex: 1, alignItems: 'center', gap: Spacing.one, justifyContent: 'flex-end' },
  bar: { width: '70%', maxWidth: 28, borderRadius: Radius.sm },
  barLabel: { fontSize: 10 },
  barValue: { fontSize: 10 },
  weekRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  weekLabel: { width: 48 },
  weekBarTrack: { flex: 1, height: 12, borderRadius: Radius.full, overflow: 'hidden' },
  weekBarFill: { height: '100%', borderRadius: Radius.full },
  weekMeta: { width: 130, textAlign: 'right', fontSize: 11 },
  achievements: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  achievement: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: Radius.lg,
    padding: Spacing.two,
    gap: Spacing.half,
    alignItems: 'center',
  },
  achievementIcon: { fontSize: 28 },
  achievementTitle: { textAlign: 'center' },
});

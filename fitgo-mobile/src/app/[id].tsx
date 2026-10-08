import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { FitGoButton, FitGoCard, Pill } from '@/components/fitgo-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import {
  EQUIPAMENTO_LABEL,
  NIVEL_LABEL,
  OBJETIVO_LABEL,
  getExerciseById,
  getWorkoutById,
} from '@/constants/mockData';
import { addSession } from '@/services/storage';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tela de detalhe/execução de um treino (dados mockados).
 * Permite marcar o treino como concluído — a sessão é salva no AsyncStorage
 * e aparece na tela de Progresso.
 */
export default function TreinoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workout = useMemo(() => (id ? getWorkoutById(id) : undefined), [id]);
  const [concluido, setConcluido] = useState(false);

  if (!workout) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Treino não encontrado.</ThemedText>
      </ThemedView>
    );
  }

  const concluir = async () => {
    await addSession({
      workoutId: workout.id,
      dataISO: new Date().toISOString(),
      duracaoMin: workout.duracaoMin,
      calorias: workout.caloriasEstimadas,
    });
    setConcluido(true);
    Alert.alert('Treino concluído! 🎉', `+${workout.caloriasEstimadas} kcal queimadas. Continue assim!`);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: workout.nome }} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: BottomTabInset + Spacing.five },
        ]}>
        <View style={styles.header}>
          <View style={[styles.emojiBox, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.emoji}>{workout.emoji}</ThemedText>
          </View>
          <ThemedText type="subtitle">{workout.nome}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.desc}>
            {workout.descricao}
          </ThemedText>
          <View style={styles.pills}>
            <Pill label={NIVEL_LABEL[workout.nivel]} />
            <Pill label={OBJETIVO_LABEL[workout.objetivo]} />
            <Pill label={`⏱ ${workout.duracaoMin} min`} />
            <Pill label={`🔥 ~${workout.caloriasEstimadas} kcal`} tone="warning" />
          </View>
        </View>

        {workout.exercicios.map((we, idx) => {
          const ex = getExerciseById(we.exerciseId);
          if (!ex) return null;
          return (
            <FitGoCard key={`${we.exerciseId}-${idx}`}>
              <View style={styles.exHeader}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  {String(idx + 1).padStart(2, '0')}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.exName}>
                  {ex.nome}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {ex.descricao}
              </ThemedText>
              <ThemedText type="small">
                {we.series} séries × {we.repeticoes} · descanso {we.descansoSeg}s
              </ThemedText>
              <View style={styles.equipRow}>
                {ex.equipamentos.map((eq) => (
                  <View
                    key={eq}
                    style={[styles.equipTag, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="small" themeColor="textSecondary">
                      {EQUIPAMENTO_LABEL[eq]}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <ThemedText type="small" style={{ color: theme.success }}>
                💡 {ex.dica}
              </ThemedText>
            </FitGoCard>
          );
        })}

        <FitGoButton
          label={concluido ? '✔ Concluído!' : 'Concluir treino'}
          variant={concluido ? 'secondary' : 'primary'}
          disabled={concluido}
          onPress={concluir}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  header: { gap: Spacing.two, alignItems: 'center' },
  emojiBox: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 36 },
  desc: { textAlign: 'center' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, justifyContent: 'center' },
  exHeader: { flexDirection: 'row', gap: Spacing.two, alignItems: 'baseline' },
  exName: { flex: 1 },
  equipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  equipTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
});

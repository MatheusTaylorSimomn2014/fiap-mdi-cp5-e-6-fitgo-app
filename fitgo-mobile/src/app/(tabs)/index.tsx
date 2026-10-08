import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitGoButton, FitGoCard, Pill } from '@/components/fitgo-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import {
  NIVEL_LABEL,
  OBJETIVO_LABEL,
  UserProfile,
  suggestWorkoutForUser,
} from '@/constants/mockData';
import { WorkoutSession, computeStreak, greetingForNow, loadSessions, loadUser } from '@/services/storage';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tela Home do FitGo: saudação, resumo de streak/treinos da semana e
 * sugestão de treino personalizada (mock) com atalho para a execução.
 */
export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    loadUser().then(setUser);
    loadSessions().then(setSessions);
  }, []);

  const sugestao = useMemo(() => (user ? suggestWorkoutForUser(user) : null), [user]);
  const streak = useMemo(() => computeStreak(sessions), [sessions]);

  // Treinos nos últimos 7 dias (sessões reais + base mockada de 3)
  const treinosSemana = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const recentes = sessions.filter((s) => new Date(s.dataISO).getTime() >= weekAgo).length;
    return Math.min(7, 3 + recentes);
  }, [sessions]);

  const meta = user?.metaSemanalDeTreinos ?? 4;
  const progressoMeta = Math.min(treinosSemana / meta, 1);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.three, paddingBottom: BottomTabInset + Spacing.five },
        ]}>
        {/* Cabeçalho com logo */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo-fitgo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.greetingBox}>
            <ThemedText type="subtitle">
              {greetingForNow()}
              {user ? `, ${user.nome.split(' ')[0]}` : ''}! 👋
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              Pronto para manter a rotina hoje?
            </ThemedText>
          </View>
        </View>

        {/* Resumo rápido */}
        <View style={styles.statsRow}>
          <FitGoCard style={styles.statCard}>
            <ThemedText type="title" style={[styles.statNumber, { color: theme.primary }]}>
              {streak}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              🔥 streak (dias)
            </ThemedText>
          </FitGoCard>
          <FitGoCard style={styles.statCard}>
            <ThemedText type="title" style={[styles.statNumber, { color: theme.primary }]}>
              {treinosSemana}/{meta}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              📅 treinos na semana
            </ThemedText>
          </FitGoCard>
        </View>

        {/* Barra de progresso da meta semanal */}
        <FitGoCard>
          <ThemedText type="smallBold">Meta semanal</ThemedText>
          <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressoMeta * 100}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {progressoMeta >= 1
              ? '🎉 Meta batida! Você está inspirando.'
              : `Faltam ${Math.max(meta - treinosSemana, 0)} treinos para bater sua meta.`}
          </ThemedText>
        </FitGoCard>

        {/* Sugestão de treino do dia */}
        {sugestao && user && (
          <FitGoCard style={{ borderColor: theme.primary }}>
            <ThemedText type="smallBold">Treino sugerido para você ✨</ThemedText>
            <View style={styles.suggestionRow}>
              <View style={[styles.emojiBox, { backgroundColor: theme.accent }]}>
                <ThemedText style={styles.emoji}>{sugestao.emoji}</ThemedText>
              </View>
              <View style={styles.suggestionInfo}>
                <ThemedText type="smallBold" style={styles.suggestionName}>
                  {sugestao.nome}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                  {sugestao.descricao}
                </ThemedText>
                <View style={styles.pillRow}>
                  <Pill label={NIVEL_LABEL[user.nivel]} />
                  <Pill label={OBJETIVO_LABEL[sugestao.objetivo]} />
                  <Pill label={`⏱ ${sugestao.duracaoMin} min`} />
                </View>
              </View>
            </View>
            <FitGoButton label="Começar treino" onPress={() => router.push(`/${sugestao.id}` as any)} />
            <FitGoButton
              label="Ver todos os treinos"
              variant="ghost"
              onPress={() => router.push('/treinos')}
            />
          </FitGoCard>
        )}

        {/* Destaque do modelo freemium */}
        {!user?.premium && (
          <FitGoCard>
            <ThemedText type="smallBold">FitGo Premium 🚀</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Planos ilimitados com IA, estatísticas detalhadas e sem anúncios por R$ 19,90/mês.
            </ThemedText>
            <FitGoButton label="Conhecer o Premium" variant="secondary" onPress={() => router.push('/perfil')} />
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
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  logo: { width: 64, height: 64 },
  greetingBox: { flex: 1, gap: Spacing.half },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 26, lineHeight: 34 },
  progressTrack: { height: 12, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: Radius.full },
  suggestionRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  emojiBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
  suggestionInfo: { flex: 1, gap: Spacing.one },
  suggestionName: { fontSize: 16 },
  pillRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap', marginTop: Spacing.half },
});

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitGoButton, FitGoCard, Pill } from '@/components/fitgo-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import {
  EQUIPAMENTO_LABEL,
  Equipamento,
  NIVEL_LABEL,
  Nivel,
  OBJETIVO_LABEL,
  Objetivo,
  UserProfile,
} from '@/constants/mockData';
import { loadUser, saveUser } from '@/services/storage';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tela de Perfil: visualização e edição do perfil (objetivo, nível,
 * equipamentos e meta semanal), com persistência em AsyncStorage.
 * Inclui card do modelo de negócio freemium (upgrade Premium).
 */
export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText themeColor="textSecondary">Carregando perfil…</ThemedText>
      </ThemedView>
    );
  }

  const update = (patch: Partial<UserProfile>) => {
    const next = { ...user, ...patch };
    setUser(next);
    saveUser(next);
  };

  const cycleObjetivo = () => {
    const opts: Objetivo[] = ['emagrecimento', 'ganho_de_massa', 'condicionamento'];
    update({ objetivo: opts[(opts.indexOf(user.objetivo) + 1) % opts.length] });
  };

  const cycleNivel = () => {
    const opts: Nivel[] = ['iniciante', 'intermediario', 'avancado'];
    update({ nivel: opts[(opts.indexOf(user.nivel) + 1) % opts.length] });
  };

  const toggleEquipamento = (eq: Equipamento) => {
    const has = user.equipamentos.includes(eq);
    update({
      equipamentos: has ? user.equipamentos.filter((e) => e !== eq) : [...user.equipamentos, eq],
    });
  };

  const imc = (user.pesoAtualKg / Math.pow(user.alturaCm / 100, 2)).toFixed(1);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.three, paddingBottom: BottomTabInset + Spacing.five },
        ]}>
        {/* Cabeçalho do perfil */}
        <FitGoCard>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
              <ThemedText type="subtitle" style={{ color: theme.onPrimary }}>
                {user.nome.charAt(0)}
              </ThemedText>
            </View>
            <View style={styles.avatarInfo}>
              <ThemedText type="smallBold" style={styles.name}>
                {user.nome}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {user.email}
              </ThemedText>
              <View style={styles.pillRow}>
                <Pill label={user.premium ? '⭐ Premium' : 'Free'} tone={user.premium ? 'success' : 'default'} />
                <Pill label={`IMC ${imc}`} />
              </View>
            </View>
          </View>
        </FitGoCard>

        {/* Preferências de treino */}
        <FitGoCard>
          <ThemedText type="smallBold">Preferências</ThemedText>
          <Pressable onPress={cycleObjetivo} style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">
              Objetivo
            </ThemedText>
            <ThemedText type="smallBold">{OBJETIVO_LABEL[user.objetivo]} ↻</ThemedText>
          </Pressable>
          <Pressable onPress={cycleNivel} style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">
              Nível
            </ThemedText>
            <ThemedText type="smallBold">{NIVEL_LABEL[user.nivel]} ↻</ThemedText>
          </Pressable>
          <View style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">
              Meta semanal
            </ThemedText>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => update({ metaSemanalDeTreinos: Math.max(1, user.metaSemanalDeTreinos - 1) })}
                style={[styles.stepBtn, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">−</ThemedText>
              </Pressable>
              <ThemedText type="smallBold">{user.metaSemanalDeTreinos}x</ThemedText>
              <Pressable
                onPress={() => update({ metaSemanalDeTreinos: Math.min(7, user.metaSemanalDeTreinos + 1) })}
                style={[styles.stepBtn, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">+</ThemedText>
              </Pressable>
            </View>
          </View>
        </FitGoCard>

        {/* Equipamentos disponíveis */}
        <FitGoCard>
          <ThemedText type="smallBold">Equipamentos disponíveis</ThemedText>
          <View style={styles.equipGrid}>
            {(Object.keys(EQUIPAMENTO_LABEL) as Equipamento[]).map((eq) => {
              const active = user.equipamentos.includes(eq);
              return (
                <Pressable
                  key={eq}
                  onPress={() => toggleEquipamento(eq)}
                  style={[
                    styles.equipChip,
                    {
                      backgroundColor: active ? theme.primary : theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{ color: active ? theme.onPrimary : theme.textSecondary }}>
                    {EQUIPAMENTO_LABEL[eq]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </FitGoCard>

        {/* Dados corporais */}
        <FitGoCard>
          <ThemedText type="smallBold">Dados corporais</ThemedText>
          <View style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">
              Peso atual
            </ThemedText>
            <ThemedText type="smallBold">{user.pesoAtualKg} kg</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">
              Altura
            </ThemedText>
            <ThemedText type="smallBold">{user.alturaCm} cm</ThemedText>
          </View>
        </FitGoCard>

        {/* Modelo freemium (CP5: ideia de venda) */}
        {!user.premium && (
          <FitGoCard style={{ borderColor: theme.primary }}>
            <ThemedText type="smallBold">FitGo Premium 🚀</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Treinos ilimitados, planos com IA, estatísticas detalhadas e sem anúncios.
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              R$ 19,90/mês ou R$ 199,90/ano
            </ThemedText>
            <FitGoButton label='Assinar Premium (simulado)' onPress={() => update({ premium: true })} />
          </FitGoCard>
        )}

        <View style={styles.row}>
          <ThemedText type="small" themeColor="textSecondary">
            Modo escuro (simulação)
          </ThemedText>
          <Switch value={false} disabled />
        </View>
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
    gap: Spacing.three,
  },
  avatarRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: { flex: 1, gap: Spacing.half },
  name: { fontSize: 18 },
  pillRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.half },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  equipChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});

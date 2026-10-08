/**
 * Camada de persistência local (mock de API) baseada em AsyncStorage.
 *
 * Guarda: perfil do usuário e sessões de treino concluídas.
 * Em versões futuras estas funções serão substituídas por chamadas à API real.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOCK_USER, UserProfile } from '@/constants/mockData';

const USER_KEY = '@fitgo/user';
const SESSIONS_KEY = '@fitgo/sessions';

export interface WorkoutSession {
  workoutId: string;
  dataISO: string;
  duracaoMin: number;
  calorias: number;
}

export async function loadUser(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return MOCK_USER;
    return { ...MOCK_USER, ...JSON.parse(raw) };
  } catch {
    return MOCK_USER;
  }
}

export async function saveUser(user: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // falha silenciosa em modo mock
  }
}

export async function loadSessions(): Promise<WorkoutSession[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as WorkoutSession[]) : [];
  } catch {
    return [];
  }
}

export async function addSession(session: WorkoutSession): Promise<WorkoutSession[]> {
  const sessions = await loadSessions();
  const next = [...sessions, session];
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
  } catch {
    // falha silenciosa em modo mock
  }
  return next;
}

/** Streak simples: dias consecutivos (a partir de hoje ou ontem) com treino. */
export function computeStreak(sessions: WorkoutSession[]): number {
  const days = new Set(sessions.map((s) => s.dataISO.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

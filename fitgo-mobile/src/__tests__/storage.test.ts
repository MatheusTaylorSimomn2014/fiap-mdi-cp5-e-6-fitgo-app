/**
 * Testes unitários da camada de persistência local (storage.ts).
 * AsyncStorage é mockado; as funções puras (streak/saudação) são testadas diretamente.
 */

import {
  computeStreak,
  greetingForNow,
  loadUser,
  saveUser,
  loadSessions,
  addSession,
  type WorkoutSession,
} from '@/services/storage';
import { MOCK_USER } from '@/constants/mockData';

// Mock do AsyncStorage com um Map em memória.
// A variável precisa ter prefixo "mock" para ser referenciada dentro do factory do jest.mock.
var mockStore = new Map<string, string>();
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
}));

beforeEach(() => {
  mockStore.clear();
});

describe('loadUser / saveUser', () => {
  it('retorna o usuário mock padrão quando não há nada salvo', async () => {
    const user = await loadUser();
    expect(user.nome).toBe(MOCK_USER.nome);
  });

  it('persiste e recupera alterações do perfil', async () => {
    const alterado = { ...MOCK_USER, nome: 'Henrique QA' };
    await saveUser(alterado);
    const user = await loadUser();
    expect(user.nome).toBe('Henrique QA');
  });
});

describe('loadSessions / addSession', () => {
  it('lista vazia quando não há sessões', async () => {
    expect(await loadSessions()).toEqual([]);
  });

  it('adiciona sessão e mantém histórico ordenado de inserção', async () => {
    const s1: WorkoutSession = { workoutId: 'w1', dataISO: '2026-09-28T10:00:00Z', duracaoMin: 30, calorias: 210 };
    const s2: WorkoutSession = { workoutId: 'w2', dataISO: '2026-09-29T10:00:00Z', duracaoMin: 45, calorias: 320 };
    await addSession(s1);
    const resultado = await addSession(s2);
    expect(resultado).toHaveLength(2);
    expect(resultado[1].workoutId).toBe('w2');
    expect(await loadSessions()).toHaveLength(2);
  });
});

describe('computeStreak', () => {
  const dia = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  };

  it('zero quando não há sessões', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('conta dias consecutivos incluindo hoje', () => {
    const sessions: WorkoutSession[] = [0, 1, 2].map((o) => ({
      workoutId: 'w',
      dataISO: `${dia(o)}T12:00:00Z`,
      duracaoMin: 30,
      calorias: 200,
    }));
    expect(computeStreak(sessions)).toBe(3);
  });

  it('permite streak começando ontem (sem treino hoje ainda)', () => {
    const sessions: WorkoutSession[] = [1, 2].map((o) => ({
      workoutId: 'w',
      dataISO: `${dia(o)}T12:00:00Z`,
      duracaoMin: 30,
      calorias: 200,
    }));
    expect(computeStreak(sessions)).toBe(2);
  });

  it('zera quando há intervalo entre os dias treinados', () => {
    const sessions: WorkoutSession[] = [5, 7].map((o) => ({
      workoutId: 'w',
      dataISO: `${dia(o)}T12:00:00Z`,
      duracaoMin: 30,
      calorias: 200,
    }));
    expect(computeStreak(sessions)).toBe(0);
  });
});

describe('greetingForNow', () => {
  it('retorna uma das três saudações válidas', () => {
    expect(['Bom dia', 'Boa tarde', 'Boa noite']).toContain(greetingForNow());
  });
});

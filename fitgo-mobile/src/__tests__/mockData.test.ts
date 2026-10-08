/**
 * Testes unitários da camada de dados mockados (FitGo).
 * Cobre integridade dos dados e funções de negócio puras.
 */

import {
  EXERCISES,
  WORKOUTS,
  ACHIEVEMENTS,
  MOCK_USER,
  getExerciseById,
  getWorkoutById,
  getWorkoutsByNivel,
  suggestWorkoutForUser,
  NIVEL_LABEL,
} from '@/constants/mockData';

describe('Integridade dos dados mockados', () => {
  it('possui exercícios e treinos cadastrados', () => {
    expect(EXERCISES.length).toBeGreaterThan(0);
    expect(WORKOUTS.length).toBeGreaterThan(0);
    expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  it('todos os IDs de exercícios são únicos', () => {
    const ids = EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todos os IDs de treinos são únicos', () => {
    const ids = WORKOUTS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo exercício referenciado por um treino existe na base', () => {
    for (const workout of WORKOUTS) {
      for (const item of workout.exercicios) {
        expect(getExerciseById(item.exerciseId)).toBeDefined();
      }
    }
  });

  it('níveis dos treinos são válidos', () => {
    const validos = Object.keys(NIVEL_LABEL);
    for (const w of WORKOUTS) {
      expect(validos).toContain(w.nivel);
    }
  });
});

describe('getExerciseById / getWorkoutById', () => {
  it('retorna o item correto quando existe', () => {
    const alvo = EXERCISES[0];
    expect(getExerciseById(alvo.id)).toBe(alvo);
  });

  it('retorna undefined para id inexistente', () => {
    expect(getExerciseById('id-que-nao-existe')).toBeUndefined();
    expect(getWorkoutById('id-que-nao-existe')).toBeUndefined();
  });
});

describe('getWorkoutsByNivel', () => {
  it('sem nível retorna a lista completa', () => {
    expect(getWorkoutsByNivel()).toHaveLength(WORKOUTS.length);
  });

  it('filtra apenas pelo nível solicitado', () => {
    const iniciantes = getWorkoutsByNivel('iniciante');
    expect(iniciantes.length).toBeGreaterThan(0);
    expect(iniciantes.every((w) => w.nivel === 'iniciante')).toBe(true);
  });
});

describe('suggestWorkoutForUser', () => {
  it('sugere um treino que casa objetivo e nível do usuário quando possível', () => {
    const sugestao = suggestWorkoutForUser(MOCK_USER);
    expect(sugestao).toBeDefined();
    expect(sugestao.nivel).toBe(MOCK_USER.nivel);
    // se existem treinos com objetivo+nível, o sugerido deve ter o mesmo objetivo
    const haMatchExato = WORKOUTS.some(
      (w) => w.objetivo === MOCK_USER.objetivo && w.nivel === MOCK_USER.nivel
    );
    if (haMatchExato) {
      expect(sugestao.objetivo).toBe(MOCK_USER.objetivo);
    }
  });

  it('nunca lança erro mesmo para perfil sem correspondência exata', () => {
    const orphan = { ...MOCK_USER, nivel: 'avancado' as const, objetivo: 'condicionamento' as const };
    expect(() => suggestWorkoutForUser(orphan)).not.toThrow();
  });
});

/**
 * Tipos de domínio e dados mockados do FitGo.
 *
 * O papel destes dados (Dev Back/Mock — Yuri Silveira) é simular a API:
 * biblioteca de exercícios, treinos por nível/objetivo, conquistas e
 * estatísticas de progresso usadas nas telas Home, Treinos, Progresso e Perfil.
 */

export type Nivel = 'iniciante' | 'intermediario' | 'avancado';

export type Objetivo = 'emagrecimento' | 'ganho_de_massa' | 'condicionamento';

export type GrupoMuscular =
  | 'peito'
  | 'costas'
  | 'pernas'
  | 'gluteos'
  | 'abdomen'
  | 'ombros'
  | 'bracos'
  | 'corpo_todo';

export type Equipamento = 'nenhum' | 'halteres' | 'elastico' | 'barra' | 'caneca';

export interface Exercise {
  id: string;
  nome: string;
  descricao: string;
  grupoMuscular: GrupoMuscular;
  nivel: Nivel;
  equipamentos: Equipamento[];
  /** séries x repetições sugeridas para o nível padrão */
  series: number;
  repeticoes: string;
  /** duração em segundos quando o exercício é isométrico/timed */
  duracaoSeg?: number;
  dica: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  series: number;
  repeticoes: string;
  descansoSeg: number;
}

export interface Workout {
  id: string;
  nome: string;
  descricao: string;
  nivel: Nivel;
  objetivo: Objetivo;
  duracaoMin: number;
  caloriasEstimadas: number;
  exercicios: WorkoutExercise[];
  /** emoji usado como ícone do card (identidade visual leve do app) */
  emoji: string;
}

export interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  desbloqueada: boolean;
  data?: string;
}

export interface WeightPoint {
  /** dia do mês ou semana ISO */
  label: string;
  pesoKg: number;
}

export interface WeekStats {
  semanaLabel: string;
  treinosConcluidas: number;
  minutosTotais: number;
  cargaTotalKg: number;
}

export interface UserProfile {
  nome: string;
  email: string;
  objetivo: Objetivo;
  nivel: Nivel;
  equipamentos: Equipamento[];
  pesoAtualKg: number;
  alturaCm: number;
  metaSemanalDeTreinos: number;
  premium: boolean;
}

// ---------------------------------------------------------------------------
// Biblioteca de exercícios (mock)
// ---------------------------------------------------------------------------

export const EXERCISES: Exercise[] = [
  {
    id: 'polichinelo',
    nome: 'Polichinelo',
    descricao:
      'Exercício aeróbico de corpo inteiro: salte abrindo braços e pernas simultaneamente.',
    grupoMuscular: 'corpo_todo',
    nivel: 'iniciante',
    equipamentos: ['nenhum'],
    series: 3,
    repeticoes: '40 seg',
    duracaoSeg: 40,
    dica: 'Mantenha o abdômen contraído e caia suavemente na ponta dos pés.',
  },
  {
    id: 'agachamento_livre',
    nome: 'Agachamento livre',
    descricao: 'Agache flexionando quadris e joelhos até as coxas ficarem paralelas ao chão.',
    grupoMuscular: 'pernas',
    nivel: 'iniciante',
    equipamentos: ['nenhum'],
    series: 4,
    repeticoes: '12-15',
    dica: 'Joelhos alinhados com a ponta dos pés, coluna neutra e peito aberto.',
  },
  {
    id: 'flexao_de_banco',
    nome: 'Flexão inclinada no banco',
    descricao: 'Flexão de braços com mãos apoiadas em um banco ou mesa para reduzir a carga.',
    grupoMuscular: 'peito',
    nivel: 'iniciante',
    equipamentos: ['nenhum'],
    series: 3,
    repeticoes: '10-12',
    dica: 'Quanto mais vertical o apoio, mais fácil o movimento.',
  },
  {
    id: 'prancha_isometrica',
    nome: 'Prancha isométrica',
    descricao: 'Sustente o corpo em linha reta apoiado nos antebraços e pontas dos pés.',
    grupoMuscular: 'abdomen',
    nivel: 'iniciante',
    equipamentos: ['nenhum'],
    series: 3,
    repeticoes: '30 seg',
    duracaoSeg: 30,
    dica: 'Não deixe o quadril cair nem subir demais.',
  },
  {
    id: 'elevacao_de_quadril',
    nome: 'Elevação pélvica (glute bridge)',
    descricao: 'Deitado, eleve o quadril contraindo os glúteos até formar uma linha reta.',
    grupoMuscular: 'gluteos',
    nivel: 'iniciante',
    equipamentos: ['nenhum'],
    series: 3,
    repeticoes: '15',
    dica: 'Segure 2 segundos no topo contraindo forte os glúteos.',
  },
  {
    id: 'flexao_de_braco',
    nome: 'Flexão de braço',
    descricao: 'Flexão tradicional com apoio das mãos e pontas dos pés no chão.',
    grupoMuscular: 'peito',
    nivel: 'intermediario',
    equipamentos: ['nenhum'],
    series: 4,
    repeticoes: '12-15',
    dica: 'Desça até o peito quase tocar o chão, cotovelos a ~45° do tronco.',
  },
  {
    id: 'afundo_alternado',
    nome: 'Afundo alternado',
    descricao: 'Passo à frente dobrando ambos os joelhos a 90° e retorne alternando as pernas.',
    grupoMuscular: 'pernas',
    nivel: 'intermediario',
    equipamentos: ['halteres'],
    series: 3,
    repeticoes: '10 cada perna',
    dica: 'Passada longa ativa mais glúteos; curta ativa mais quadríceps.',
  },
  {
    id: 'remada_unilateral',
    nome: 'Remada unilateral com halter',
    descricao: 'Apoie um joelho e mão no banco e puxe o halter em direção ao quadril.',
    grupoMuscular: 'costas',
    nivel: 'intermediario',
    equipamentos: ['halteres'],
    series: 4,
    repeticoes: '10 cada lado',
    dica: 'Puxe com o cotovelo rente ao corpo e controle a descida.',
  },
  {
    id: 'desenvolvimento_ombros',
    nome: 'Desenvolvimento de ombros',
    descricao: 'Empurre halteres da altura das orelhas até a extensão completa dos braços.',
    grupoMuscular: 'ombros',
    nivel: 'intermediario',
    equipamentos: ['halteres'],
    series: 3,
    repeticoes: '10-12',
    dica: 'Evite arquear a lombar; contraia o abdômen durante o movimento.',
  },
  {
    id: 'rosca_direta',
    nome: 'Rosca direta com halteres',
    descricao: 'Flexione os cotovelos elevando halteres até contração total do bíceps.',
    grupoMuscular: 'bracos',
    nivel: 'intermediario',
    equipamentos: ['halteres'],
    series: 3,
    repeticoes: '12',
    dica: 'Cotovelos fixos ao lado do corpo, sem balançar o tronco.',
  },
  {
    id: 'burpee',
    nome: 'Burpee',
    descricao: 'Combine agachamento, prancha, flexão e salto em um movimento explosivo.',
    grupoMuscular: 'corpo_todo',
    nivel: 'avancado',
    equipamentos: ['nenhum'],
    series: 4,
    repeticoes: '10',
    dica: 'Cadência controlada vale mais que velocidade mal executada.',
  },
  {
    id: 'agachamento_frontal',
    nome: 'Agachamento frontal com barra',
    descricao: 'Agachamento com barra apoiada na parte anterior dos ombros (rack position).',
    grupoMuscular: 'pernas',
    nivel: 'avancado',
    equipamentos: ['barra'],
    series: 5,
    repeticoes: '8',
    dica: 'Cotovelos altos durante todo o movimento para não perder o equilíbrio.',
  },
  {
    id: 'barra_fixa',
    nome: 'Barra fixa pronada',
    descricao: 'Puxe o corpo até o queixo passar da barra usando dorsais e bíceps.',
    grupoMuscular: 'costas',
    nivel: 'avancado',
    equipamentos: ['barra'],
    series: 4,
    repeticoes: 'max',
    dica: 'Sem impulso: suba e desça de forma controlada.',
  },
  {
    id: 'prancha_lateral',
    nome: 'Prancha lateral com toque',
    descricao: 'Prancha lateral tocando o chão com a mão livre sob o tronco.',
    grupoMuscular: 'abdomen',
    nivel: 'avancado',
    equipamentos: ['nenhum'],
    series: 3,
    repeticoes: '10 cada lado',
    dica: 'Mantenha o quadril elevado mesmo durante o toque.',
  },
  {
    id: 'salto_caixa',
    nome: 'Salto na caixa',
    descricao: 'Salte de pé sobre uma caixa ou degrau alto e absorva a aterrissagem.',
    grupoMuscular: 'pernas',
    nivel: 'avancado',
    equipamentos: ['nenhum'],
    series: 4,
    repeticoes: '8',
    dica: 'Aterrisse com joelhos semiflexionados, nunca estalados.',
  },
];

// ---------------------------------------------------------------------------
// Treinos prontos (mock)
// ---------------------------------------------------------------------------

const ex = (exerciseId: string, series: number, repeticoes: string, descansoSeg: number): WorkoutExercise => ({
  exerciseId,
  series,
  repeticoes,
  descansoSeg,
});

export const WORKOUTS: Workout[] = [
  {
    id: 'w_init_full',
    nome: 'Despertor Full Body',
    descricao: 'Primeiro contato com o movimento: corpo inteiro, sem equipamentos.',
    nivel: 'iniciante',
    objetivo: 'condicionamento',
    duracaoMin: 20,
    caloriasEstimadas: 120,
    emoji: '🌱',
    exercicios: [
      ex('polichinelo', 3, '40 seg', 30),
      ex('agachamento_livre', 3, '12', 45),
      ex('flexao_de_banco', 3, '10', 45),
      ex('elevacao_de_quadril', 3, '15', 30),
      ex('prancha_isometrica', 3, '30 seg', 30),
    ],
  },
  {
    id: 'w_init_hiit',
    nome: 'Queima-Guia HIIT Leve',
    descricao: 'Circuito metabólico de baixo impacto para acelerar o emagrecimento.',
    nivel: 'iniciante',
    objetivo: 'emagrecimento',
    duracaoMin: 15,
    caloriasEstimadas: 150,
    emoji: '🔥',
    exercicios: [
      ex('polichinelo', 4, '40 seg', 20),
      ex('agachamento_livre', 4, '15', 20),
      ex('elevacao_de_quadril', 4, '20', 20),
      ex('prancha_isometrica', 4, '30 seg', 30),
    ],
  },
  {
    id: 'w_int_push',
    nome: 'Empurrar & Modelar',
    descricao: 'Peito, ombros e tríceps com halteres para ganhar massa magra.',
    nivel: 'intermediario',
    objetivo: 'ganho_de_massa',
    duracaoMin: 35,
    caloriasEstimadas: 220,
    emoji: '💪',
    exercicios: [
      ex('flexao_de_braco', 4, '12', 60),
      ex('desenvolvimento_ombros', 4, '10', 60),
      ex('afundo_alternado', 3, '10 cada perna', 60),
      ex('rosca_direta', 3, '12', 45),
    ],
  },
  {
    id: 'w_int_legs',
    nome: 'Pernas de Aço',
    descricao: 'Trem inferior completo: força, resistência e glúteos.',
    nivel: 'intermediario',
    objetivo: 'ganho_de_massa',
    duracaoMin: 40,
    caloriasEstimadas: 260,
    emoji: '🦵',
    exercicios: [
      ex('agachamento_livre', 4, '15', 60),
      ex('afundo_alternado', 4, '10 cada perna', 60),
      ex('elevacao_de_quadril', 4, '15', 45),
      ex('prancha_isometrica', 3, '45 seg', 30),
    ],
  },
  {
    id: 'w_int_back',
    nome: 'Costas & Postura',
    descricao: 'Puxadas e remadas para fortalecer costas e melhorar a postura.',
    nivel: 'intermediario',
    objetivo: 'condicionamento',
    duracaoMin: 30,
    caloriasEstimadas: 190,
    emoji: '🧗',
    exercicios: [
      ex('remada_unilateral', 4, '10 cada lado', 60),
      ex('prancha_lateral', 3, '8 cada lado', 40),
      ex('rosca_direta', 3, '12', 45),
    ],
  },
  {
    id: 'w_adv_metcon',
    nome: 'Metcon Inferno',
    descricao: 'Alta intensidade, pouca pausa: condicionamento avançado.',
    nivel: 'avancado',
    objetivo: 'emagrecimento',
    duracaoMin: 30,
    caloriasEstimadas: 400,
    emoji: '⚡',
    exercicios: [
      ex('burpee', 5, '10', 45),
      ex('salto_caixa', 5, '8', 60),
      ex('prancha_lateral', 4, '10 cada lado', 30),
      ex('polichinelo', 4, '60 seg', 20),
    ],
  },
  {
    id: 'w_adv_power',
    nome: 'Força Bruta',
    descricao: 'Básicos pesados com barra para força máxima.',
    nivel: 'avancado',
    objetivo: 'ganho_de_massa',
    duracaoMin: 50,
    caloriasEstimadas: 350,
    emoji: '🏋️',
    exercicios: [
      ex('agachamento_frontal', 5, '8', 90),
      ex('barra_fixa', 4, 'max', 90),
      ex('flexao_de_braco', 4, '15', 60),
      ex('remada_unilateral', 4, '10 cada lado', 60),
    ],
  },
  {
    id: 'w_adv_core',
    nome: 'Core Blindado',
    descricao: 'Abdômen e lombar ao máximo, com variações avançadas.',
    nivel: 'avancado',
    objetivo: 'condicionamento',
    duracaoMin: 25,
    caloriasEstimadas: 180,
    emoji: '🎯',
    exercicios: [
      ex('prancha_isometrica', 4, '60 seg', 30),
      ex('prancha_lateral', 4, '10 cada lado', 30),
      ex('burpee', 4, '10', 45),
    ],
  },
];

// ---------------------------------------------------------------------------
// Conquistas e progresso (mock)
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', titulo: 'Primeiro Suor', descricao: 'Complete seu primeiro treino', icone: '🥇', desbloqueada: true, data: '2026-09-01' },
  { id: 'a2', titulo: 'Constância', descricao: '3 treinos na mesma semana', icone: '📅', desbloqueada: true, data: '2026-09-08' },
  { id: 'a3', titulo: 'Streak de Fogo', descricao: '7 dias seguidos ativo', icone: '🔥', desbloqueada: true, data: '2026-09-15' },
  { id: 'a4', titulo: 'Levantador', descricao: 'Acumule 1.000 kg de carga total', icone: '🏋️', desbloqueada: false },
  { id: 'a5', titulo: 'Maratonista do Bem', descricao: '50 treinos concluídos', icone: '🏃', desbloqueada: false },
  { id: 'a6', titulo: 'Desafiante', descricao: 'Complete um treino avançado', icone: '⚡', desbloqueada: false },
];

export const WEIGHT_HISTORY: WeightPoint[] = [
  { label: 'Sem 1', pesoKg: 82.4 },
  { label: 'Sem 2', pesoKg: 81.8 },
  { label: 'Sem 3', pesoKg: 81.2 },
  { label: 'Sem 4', pesoKg: 80.9 },
  { label: 'Sem 5', pesoKg: 80.5 },
  { label: 'Sem 6', pesoKg: 80.1 },
  { label: 'Sem 7', pesoKg: 79.8 },
  { label: 'Sem 8', pesoKg: 79.6 },
];

export const WEEKLY_STATS: WeekStats[] = [
  { semanaLabel: 'Sem 5', treinosConcluidas: 2, minutosTotais: 70, cargaTotalKg: 1850 },
  { semanaLabel: 'Sem 6', treinosConcluidas: 3, minutosTotais: 105, cargaTotalKg: 2600 },
  { semanaLabel: 'Sem 7', treinosConcluidas: 4, minutosTotais: 140, cargaTotalKg: 3120 },
  { semanaLabel: 'Sem 8', treinosConcluidas: 3, minutosTotais: 110, cargaTotalKg: 2950 },
];

export const MOCK_USER: UserProfile = {
  nome: 'Alex Souza',
  email: 'alex@fitgo.app',
  objetivo: 'emagrecimento',
  nivel: 'intermediario',
  equipamentos: ['halteres', 'elastico'],
  pesoAtualKg: 79.6,
  alturaCm: 175,
  metaSemanalDeTreinos: 4,
  premium: false,
};

// ---------------------------------------------------------------------------
// Funções auxiliares (lógica de negócio mockada)
// ---------------------------------------------------------------------------

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}

export function getWorkoutsByNivel(nivel?: Nivel): Workout[] {
  if (!nivel) return WORKOUTS;
  return WORKOUTS.filter((w) => w.nivel === nivel);
}

export function suggestWorkoutForUser(user: UserProfile): Workout {
  const candidates = WORKOUTS.filter(
    (w) => w.objetivo === user.objetivo && w.nivel === user.nivel
  );
  const pool = candidates.length > 0 ? candidates : WORKOUTS.filter((w) => w.nivel === user.nivel);
  // "rotação" determinística simples baseada no dia do ano
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return pool[dayOfYear % pool.length] ?? WORKOUTS[0];
}

export const NIVEL_LABEL: Record<Nivel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export const OBJETIVO_LABEL: Record<Objetivo, string> = {
  emagrecimento: 'Emagrecimento',
  ganho_de_massa: 'Ganho de massa',
  condicionamento: 'Condicionamento',
};

export const EQUIPAMENTO_LABEL: Record<Equipamento, string> = {
  nenhum: 'Sem equipamento',
  halteres: 'Halteres',
  elastico: 'Elástico',
  barra: 'Barra fixa / olímpica',
  caneca: 'Caneca (garrafa d\u2019água)',
};

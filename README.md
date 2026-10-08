# Checkpoints 5 & 6 - Mobile Development e IoT:
## FitGo — Documentação Técnica e de Testes

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Decisões Técnicas (ADR)](#2-decisões-técnicas-adr)
3. [Arquitetura em Camadas](#3-arquitetura-em-camadas)
4. [Testes Automatizados (Jest + jest-expo)](#4-testes-automatizados-jest--jest-expo)
5. [Roteiro de Testes Manuais](#5-roteiro-de-testes-manuais)
6. [Evidências e Prints do App](#6-evidencias-prints-app)
7. [Checklist de Regressão (CP6)](#7-checklist-de-regressão-cp6)

---

## 1. Visão Geral

O **FitGo** é um protótipo mobile de aplicativo de treinos, desenvolvido com **Expo SDK + React Native + TypeScript**, entregue como parte dos Checkpoints 5 e 6. Este documento consolida:

- As **decisões técnicas** de arquitetura e bibliotecas (formato ADR);
- A **estratégia de testes** — automatizados (Jest) **e** roteiro manual documentado.

---

## 2. Decisões Técnicas (ADR)

### ADR-001 — Expo SDK + React Native + TypeScript

- **Contexto:** entrega acadêmica com prazo curto; necessidade de build Android sem configurar NDK/Gradle manualmente.
- **Decisão:** projeto bootstrapped com **Expo (~57)** e **TypeScript strict**.
- **Consequência:** upgrade path simples, EAS Build para APK; limitação de native modules fora da config preflight (aceitável para o escopo).

### ADR-002 — Navegação: expo-router (file-based) em vez de React Navigation puro

- **Decisão:** `expo-router` com grupo `(tabs)` (Home, Treinos, Progresso, Perfil) + rota dinâmica `[id].tsx` para detalhe do treino.
- **Motivo:** menos boilerplate, deep-linking automático e URLs previsíveis (útil também na simulação em navegador exigida pelo CP5).

### ADR-003 — Dados mockados locais em vez de backend/json-server

- **Decisão:** módulo `src/constants/mockData.ts` com tipos fortes (`Exercise`, `Workout`, `UserProfile`, `Achievement`, `WeightPoint`) e funções puras de consulta/recomendação (`suggestWorkoutForUser` etc.).
- **Motivo:** protótipo funcional sem rede; a interface dos dados já espelha o contrato futuro da API real, permitindo troca por `fetch` sem mudar as telas.

### ADR-004 — Persistência local: AsyncStorage isolada em `src/services/storage.ts`

- **Decisão:** nenhuma tela chama AsyncStorage diretamente; tudo passa pela camada de serviço (`loadUser`/`saveUser`, `loadSessions`/`addSession`, streak).
- **Motivo:** testabilidade (mock fácil no Jest) e substituição futura por SQLite/API sem tocar na UI.

### ADR-005 — Identidade visual centralizada em `src/constants/colors.ts`

- **Decisão:** paleta oficial da marca (bege `#E9D8AE`, off-white `#FDF9F3`, preto `#0B0A0A`, marrom `#8B695C`, bege acinzentado `#B4A390`) definida como tokens e consumida por componentes compartilhados (`fitgo-ui.tsx`).
- **Motivo:** fidelidade ao conceito aprovado no CP4 (peso de 15% no CP6).

### ADR-006 — Testes: Jest + preset jest-expo, foco em lógica de negócio

- **Decisão:** suítes em `src/__tests__/` cobrindo `mockData` e `storage` (20 casos). Testes de UI ficam para o roteiro manual documentado neste README.
- **Motivo:** melhor custo/benefício no prazo; requisito do CP5 atendido com ambiente automatizado **e** roteiro manual.

---

## 3. Arquitetura em Camadas

```
src/
├── app/            # Rotas (expo-router): tabs + detalhe de treino
├── components/     # UI compartilhada (cards, botões, textos temáticos)
├── constants/      # colors.ts (tokens) + mockData.ts (dados/tipos/funções puras)
├── hooks/          # tema/dark-mode do template Expo
└── services/       # storage.ts (persistência local isolada)
```

**Fluxo de dados:** Tela → service (storage) / mockData (funções puras) → AsyncStorage.
Nenhuma tela conhece o mecanismo de persistência.

---

## 4. Testes Automatizados (Jest + jest-expo)

### Como executar

```bash
cd fitgo-mobile
npm install        # instala dependências (inclui jest, jest-expo)
npm test           # roda todas as suítes
```

### Suítes existentes (`src/__tests__/`)

| Arquivo | O que cobre | Qtd. casos |
|---------|-------------|-----------|
| `mockData.test.ts` | Integridade dos dados mockados (IDs únicos, referências exercício↔treino válidas, níveis válidos) e funções puras `getExerciseById`, `getWorkoutById`, `getWorkoutsByNivel`, `suggestWorkoutForUser` | 11 |
| `storage.test.ts` | Camada de persistência local com AsyncStorage mockado: `loadUser`/`saveUser`, `loadSessions`/`addSession`, cálculo de streak (`computeStreak`) e saudação dinâmica (`greetingForNow`) | 9 |

**Resultado atual:** 2 suítes, 20 testes — todos passando ✅

### Decisão técnica

Optamos por **Jest com preset `jest-expo`** em vez de testes de UI completos, pois o escopo do protótipo prioriza a lógica de negócio (recomendação de treinos e persistência local). A camada de dados foi projetada como **funções puras + serviço isolado** justamente para facilitar testabilidade sem backend real.

---

## 5. Roteiro de Testes Manuais

Executar no emulador Android Studio ou navegador (`npx expo start`).

### TM-01 — Boot e Navegação
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir o app | Splash exibe, Home carrega sem erros na console |
| 2 | Tocar em cada aba (Treinos, Progresso, Perfil) | Tela correspondente abre; ícone ativo muda de cor |
| 3 | Retornar à Home | Estado preservado, sem crash |

### TM-02 — Home / Treino do dia
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Verificar saudação | "Bom dia/Boa tarde/Boa noite, {nome}" conforme horário |
| 2 | Ver card "Treino do dia" | Treino compatível com objetivo+nível do perfil |
| 3 | Tocar no card | Navega para a tela de detalhe do treino |

### TM-03 — Catálogo de Treinos
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Filtrar por nível (Iniciante/Intermediário/Avançado) | Lista mostra apenas treinos do nível escolhido |
| 2 | Limpar filtro | Todos os treinos retornam |
| 3 | Tocar em um treino | Abre detalhe com exercícios, séries e repetições |

### TM-04 — Fluxo de Treino + Persistência
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Iniciar treino e concluir ("Finalizar") | Sessão registrada (duração/calorias estimadas) |
| 2 | Fechar e reabrir o app | Sessão ainda presente (AsyncStorage) |
| 3 | Ir à aba Progresso | Streak e estatísticas semanais atualizados |

### TM-05 — Progresso
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Ver gráfico de peso | Histórico renderiza pontos da base mockada |
| 2 | Ver conquistas | Badges exibidos com estado desbloqueado/bloqueado |

### TM-06 — Perfil
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Alterar objetivo/nível e salvar | Home passa a sugerir treino compatível |
| 2 | Reiniciar o app | Alterações persistem |

### TM-07 — Identidade Visual
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Comparar telas com prints do Figma | Paleta oficial (`#E9D8AE`, `#FDF9F3`, `#0B0A0A`, `#8B695C`, `#B4A390`) aplicada |
| 2 | Verificar tipografia/títulos | Fonte e pesos consistentes com a marca FitGo |

---

## 6. Evidencias e Prints do App

### 6.1 Tela Home

![Home](Prints_App/Home.jpg)

### 6.2 Tela de Treinos

![Treinos](Prints_App/Treinos.jpg)

### 6.3 Tela de Progresso

![Progresso](Prints_App/Progresso.jpg)


### 6.4 Tela de Perfil

![Perfil](Prints_App/Perfil.jpg)

### 6.5 Teste dos Dados mockados

![Teste-Mocks](Prints_App/TesteMock.jpg)

---

## 7. Checklist de Regressão (CP6)

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm test` com 100% de aprovação
- [ ] `npx expo export --platform web` conclui sem falhas
- [ ] Testes manuais TM-01 a TM-07 executados no emulador/navegador
- [ ] Evidências (prints/vídeo) salvos em `prints_figma/` ou anexados à release

---

*Documento consolidado a partir de `DECISOES_TECNICAS.md` e `TESTES.md`.*

# CHECKPOINT 5 & 6 — Decisões Técnicas do FitGo (ADR)

Registro das decisões de arquitetura e bibliotecas, conforme requisito
"Decisões técnicas registradas" do CP5.

---

## ADR-001 — Expo SDK + React Native + TypeScript

- **Contexto:** entrega acadêmica com prazo curto; necessidade de build Android
  sem configurar NDK/Gradle manualmente.
- **Decisão:** projeto bootstrapped com **Expo (~57)** e **TypeScript strict**.
- **Consequência:** upgrade path simples, EAS Build para APK; limitação de
  native modules fora da config preflight (aceitável para o escopo).

## ADR-002 — Navegação: expo-router (file-based) em vez de React Navigation puro

- **Decisão:** `expo-router` com grupo `(tabs)` (Home, Treinos, Progresso,
  Perfil) + rota dinâmica `[id].tsx` para detalhe do treino.
- **Motivo:** menos boilerplate, deep-linking automático e URLs previsíveis
  (útil também na simulação em navegador exigida pelo CP5).

## ADR-003 — Dados mockados locais em vez de backend/json-server

- **Decisão:** módulo `src/constants/mockData.ts` com tipos fortes
  (`Exercise`, `Workout`, `UserProfile`, `Achievement`, `WeightPoint`) e
  funções puras de consulta/recomendação (`suggestWorkoutForUser` etc.).
- **Motivo:** protótipo funcional sem rede; a interface dos dados já espelha o
  contrato futuro da API real, permitindo troca por `fetch` sem mudar as telas.

## ADR-004 — Persistência local: AsyncStorage isolada em `src/services/storage.ts`

- **Decisão:** nenhuma tela chama AsyncStorage diretamente; tudo passa pela
  camada de serviço (loadUser/saveUser, loadSessions/addSession, streak).
- **Motivo:** testabilidade (mock fácil no Jest) e substituição futura por
  SQLite/API sem tocar na UI.

## ADR-005 — Identidade visual centralizada em `src/constants/colors.ts`

- **Decisão:** paleta oficial da marca (bege #E9D8AE, off-white #FDF9F3,
  preto #0B0A0A, marrom #8B695C, bege acinzentado #B4A390) definida como tokens
  e consumida por componentes compartilhados (`fitgo-ui.tsx`).
- **Motivo:** fidelidade ao conceito aprovado no CP4 (peso de 15% no CP6).

## ADR-006 — Testes: Jest + preset jest-expo, foco em lógica de negócio

- **Decisão:** suítes em `src/__tests__/` cobrindo mockData e storage
  (20 casos). Testes de UI ficam para o roteiro manual documentado em
  `docs/TESTES.md`.
- **Motivo:** melhor custo/benefício no prazo; requisito do CP5 atendido com
  ambiente automatizado **e** roteiro manual.

## Arquitetura em camadas (resumo)

```
src/
├── app/            # Rotas (expo-router): tabs + detalhe de treino
├── components/     # UI compartilhada (cards, botões, textos temáticos)
├── constants/      # colors.ts (tokens) + mockData.ts (dados/tipos/funções puras)
├── hooks/          # tema/dark-mode do template Expo
└── services/       # storage.ts (persistência local isolada)
```

Fluxo de dados: **Tela → service (storage) / mockData (funções puras) →
AsyncStorage**. Nenhuma tela conhece o mecanismo de persistência.

# CHECKPOINT 5 & 6 — Documentação de Testes do FitGo

Este documento atende ao requisito **"Ambiente de teste configurado"** do CP5
(testes automatizados com Jest **+** roteiro de testes manuais documentado).

---

## 1. Testes Automatizados (Jest + jest-expo)

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
| `storage.test.ts` | Camada de persistência local com AsyncStorage mockado: `loadUser/saveUser`, `loadSessions/addSession`, cálculo de streak (`computeStreak`) e saudação dinâmica (`greetingForNow`) | 9 |

**Resultado atual:** 2 suítes, 20 testes — todos passando ✅

### Decisão técnica

Optamos por **Jest com preset `jest-expo`** em vez de testes de UI completos,
pois o escopo do protótipo prioriza a lógica de negócio (recomendação de treinos
e persistência local). A camada de dados foi projetada como **funções puras +
serviço isolado** justamente para facilitar testabilidade sem backend real.

---

## 2. Roteiro de Testes Manuais

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
| 1 | Comparar telas com prints do Figma | Paleta oficial (#E9D8AE, #FDF9F3, #0B0A0A, #8B695C, #B4A390) aplicada |
| 2 | Verificar tipografia/títulos | Fonte e pesos consistentes com a marca FitGo |

---

## 3. Checklist de regressão antes de cada build (CP6)

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm test` com 100% de aprovação
- [ ] `npx expo export --platform web` conclui sem falhas
- [ ] Testes manuais TM-01 a TM-07 executados no emulador/navegador
- [ ] Evidências (prints/vídeo) salvos em `prints_figma/` ou anexados à release

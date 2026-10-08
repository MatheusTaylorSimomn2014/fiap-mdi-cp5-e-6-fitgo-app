/**
 * Paleta de cores da marca FitGo (derivada da logo e do design no Figma).
 *
 * | Elemento                       | Cor               | Hex       |
 * |--------------------------------|-------------------|-----------|
 * | Fundo do círculo (bege)        | Bege              | #E9D8AE   |
 * | Texto "FIT GO" (off-white)     | Branco/Off-white  | #FDF9F3   |
 * | Listras diagonais              | Preto             | #0B0A0A   |
 * | Contorno / borda (marrom)      | Marrom            | #8B695C   |
 * | Sombra das listras             | Bege acinzentado  | #B4A390   |
 */
export const BrandColors = {
  beige: '#E9D8AE',
  offWhite: '#FDF9F3',
  black: '#0B0A0A',
  brown: '#8B695C',
  beigeGray: '#B4A390',
} as const;

/**
 * Cores semânticas usadas em todo o app, nos modos claro e escuro.
 */
export const Colors = {
  light: {
    text: '#0B0A0A',
    background: '#FDF9F3',
    backgroundElement: '#F2E9D8',
    backgroundSelected: '#E9D8AE',
    textSecondary: '#8B695C',
    primary: '#8B695C',
    onPrimary: '#FDF9F3',
    accent: '#E9D8AE',
    card: '#FFFFFF',
    success: '#4C8C67',
    danger: '#B4552D',
    border: '#B4A390',
  },
  dark: {
    text: '#FDF9F3',
    background: '#0B0A0A',
    backgroundElement: '#1F1B16',
    backgroundSelected: '#33291F',
    textSecondary: '#B4A390',
    primary: '#E9D8AE',
    onPrimary: '#0B0A0A',
    accent: '#8B695C',
    card: '#1F1B16',
    success: '#7FB894',
    danger: '#E08A5E',
    border: '#4A3F35',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

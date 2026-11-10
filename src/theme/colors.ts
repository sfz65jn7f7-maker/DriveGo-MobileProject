/** Palette Drive Go! : bleu de marque + accent jaune. Aucune couleur en dur ailleurs. */
export const lightColors = {
  primary: '#1B6098',
  onPrimary: '#FFFFFF',
  accent: '#FFB800',
  background: '#FFFFFF',
  surface: '#F4F6F8',
  surfaceElevated: '#FFFFFF',
  text: '#11151C',
  textSecondary: '#667085',
  border: '#E4E7EC',
  success: '#12B76A',
  warning: '#F79009',
  danger: '#E5322D',
  onDanger: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: typeof lightColors = {
  primary: '#3A8EE5',
  onPrimary: '#071B2E',
  accent: '#FFC933',
  background: '#0F1115',
  surface: '#1A1D23',
  surfaceElevated: '#232730',
  text: '#F2F4F7',
  textSecondary: '#98A2B3',
  border: '#2E333D',
  success: '#32D583',
  warning: '#FDB022',
  danger: '#FF5C57',
  onDanger: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.65)',
};

export type Colors = typeof lightColors;

/** Grille d'espacement : 4 / 8 / 12 / 16 / 24 / 32 */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const layout = {
  screenPadding: 20,
  touchTarget: 44,
  headerHeight: 56,
  maxContentWidth: 480, // iPad / grands écrans : contenu centré
} as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

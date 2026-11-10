/** Échelle typographique : 12 / 14 / 16 / 20 / 24 / 32 */
export const fontSize = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 } as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, lineHeight: 40 },
  heading: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, lineHeight: 32 },
  subheading: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, lineHeight: 26 },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 22 },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: 20 },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular, lineHeight: 16 },
} as const;

export type TypographyVariant = keyof typeof typography;

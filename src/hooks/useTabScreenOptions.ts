import { Platform } from 'react-native';
import { useTheme, fontSize } from '@/theme';

/** Options communes aux barres d'onglets (passager et chauffeur). */
export function useTabScreenOptions() {
  const { colors } = useTheme();
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarAllowFontScaling: false, // équivalent de maxFontSizeMultiplier pour les onglets
    tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '500' as const },
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      // Web : réserver assez de hauteur aux icônes et aux libellés.
      ...(Platform.OS === 'web' ? { height: 80, paddingTop: 6, paddingBottom: 8 } : {}),
    },
  };
}
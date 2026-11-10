import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Fabrique l'icône d'un onglet (pleine quand actif, contour sinon). */
export const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color as string} />
  );
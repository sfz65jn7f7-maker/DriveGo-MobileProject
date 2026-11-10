import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { useTheme, layout } from '@/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  padded?: boolean;
  /** Écrans d'onglets : ['top','left','right'] (la barre du bas gère la zone sûre). */
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

const ALL_EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

/** Conteneur d'écran : zones sûres, fond du thème, largeur max centrée (tablettes). */
export function Screen({ children, scroll = false, keyboard = false, padded = true, edges = ALL_EDGES, style }: Props) {
  const { colors } = useTheme();

  const inner = (
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.grow}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  ) : (
    inner
  );

  const content = keyboard ? (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.background }]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  inner: { flex: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  padded: { paddingHorizontal: layout.screenPadding },
});

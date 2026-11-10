import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';

export function Loader() {
  const { colors } = useTheme();
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/brand/Logo';
import { useTheme, spacing } from '@/theme';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = 'albums-outline', title, message, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Logo size={40} />
      <Ionicons name={icon} size={56} color={colors.textSecondary} />
      <AppText variant="subheading" style={styles.center}>
        {title}
      </AppText>
      {message ? (
        <AppText color="textSecondary" style={styles.center}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  center: { textAlign: 'center' },
  action: { marginTop: spacing.md },
});

import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme, radius, spacing, shadows } from '@/theme';

type Action = { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost' };

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  actions: Action[];
  children?: React.ReactNode;
};

export function AppModal({ visible, title, message, onClose, actions, children }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surfaceElevated }, shadows.lg]}
          onPress={() => undefined}
        >
          <AppText variant="subheading">{title}</AppText>
          {message ? (
            <AppText color="textSecondary" style={styles.message}>
              {message}
            </AppText>
          ) : null}
          {children}
          <View style={styles.actions}>
            {actions.map((a) => (
              <Button key={a.label} label={a.label} onPress={a.onPress} variant={a.variant ?? 'primary'} />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  card: { width: '100%', maxWidth: 420, padding: spacing.xl, borderRadius: radius.xl },
  message: { marginTop: spacing.sm },
  actions: { marginTop: spacing.xl, gap: spacing.sm },
});

import { Switch } from 'react-native';
import { SettingsRow } from './SettingsRow';
import { useTheme } from '@/theme';

type Props = {
  icon?: React.ComponentProps<typeof SettingsRow>['icon'];
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

/** Interrupteur à effet immédiat (pas de bouton « Enregistrer »). */
export function SettingsSwitch({ icon, label, value, onValueChange }: Props) {
  const { colors } = useTheme();
  return (
    <SettingsRow
      icon={icon}
      label={label}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          accessibilityLabel={label}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={colors.surfaceElevated}
        />
      }
    />
  );
}

import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Logo } from '@/components/brand/Logo';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme';

export default function About() {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.about')} />
      <View style={styles.brand}>
        <Logo size={72} />
        <AppText color="textSecondary">{`${t('settings.version')} v${version}`}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
});

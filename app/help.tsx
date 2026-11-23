import { useState } from 'react';
import { LayoutAnimation, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { useAuthStore } from '@/features/auth/auth.store';
import { radius, spacing, useTheme } from '@/theme';

const PASSENGER_FAQ = ['price', 'cancel', 'payment', 'safety', 'carpool', 'lost'];
const DRIVER_FAQ = ['becomeDriver', 'documents', 'counter', 'earnings', 'safety', 'cancel'];

const SUPPORT_PHONE = '+212522000000';
const SUPPORT_EMAIL = 'support@drivego.ma';
const SUPPORT_WHATSAPP = '212600000000';

export default function HelpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const isDriver = useAuthStore((s) => s.activeRole === 'driver');
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const faq = (isDriver ? DRIVER_FAQ : PASSENGER_FAQ).filter((key) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${t(`help.faq.${key}.q`)} ${t(`help.faq.${key}.a`)}`.toLowerCase().includes(q);
  });

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((current) => (current === key ? null : key));
  };

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.help')} />
      <Input leftIcon="search" placeholder={t('help.search')} value={query} onChangeText={setQuery} />

      <AppText variant="label" color="textSecondary" style={styles.section}>{t('help.faqTitle')}</AppText>
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {faq.length === 0 ? (
          <AppText color="textSecondary" style={styles.empty}>{t('help.noResult')}</AppText>
        ) : (
          faq.map((key, i) => {
            const expanded = open === key;
            return (
              <View key={key} style={i > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }}>
                <Pressable
                  onPress={() => toggle(key)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  style={styles.question}
                >
                  <AppText variant="subheading" style={styles.flex}>{t(`help.faq.${key}.q`)}</AppText>
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
                </Pressable>
                {expanded ? <AppText color="textSecondary" style={styles.answer}>{t(`help.faq.${key}.a`)}</AppText> : null}
              </View>
            );
          })
        )}
      </View>

      <SettingsSection title={t('help.contact')}>
        <SettingsRow icon="logo-whatsapp" label="WhatsApp" onPress={() => void Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}`)} />
        <SettingsRow icon="call-outline" label={t('help.call')} value={SUPPORT_PHONE} onPress={() => void Linking.openURL(`tel:${SUPPORT_PHONE}`)} />
        <SettingsRow icon="mail-outline" label={t('help.email')} value={SUPPORT_EMAIL} onPress={() => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} />
      </SettingsSection>
      <AppText variant="caption" color="textSecondary" style={styles.hours}>{t('help.hours')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { marginBottom: spacing.sm, marginHorizontal: spacing.xs },
  group: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  question: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, minHeight: 52 },
  answer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  empty: { padding: spacing.lg },
  hours: { textAlign: 'center', marginVertical: spacing.xl },
});

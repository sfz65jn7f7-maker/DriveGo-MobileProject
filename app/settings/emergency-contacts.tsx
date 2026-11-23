import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { FormField } from '@/components/form/FormField';
import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { contactSchema } from '@/features/auth/schemas';
import type { ContactForm } from '@/features/auth/schemas';
import { SettingsSwitch, SettingsSection } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import { spacing } from '@/theme';
import { ask } from '@/utils/dialog';

const MAX_CONTACTS = 3;

export default function EmergencyContactsScreen() {
  const { t } = useTranslation();
  const contacts = useSettingsStore((s) => s.emergencyContacts);
  const add = useSettingsStore((s) => s.addEmergencyContact);
  const remove = useSettingsStore((s) => s.removeEmergencyContact);
  const autoShare = useSettingsStore((s) => s.autoShareTrip);
  const setAutoShare = useSettingsStore((s) => s.setAutoShareTrip);
  const [adding, setAdding] = useState(false);
  const { control, handleSubmit, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '' },
  });

  const save = handleSubmit((values) => {
    add({ name: values.name.trim(), phone: values.phone });
    reset();
    setAdding(false);
  });

  const confirmRemove = async (id: string, name: string) => {
    const ok = await ask(t('contacts.removeTitle'), t('contacts.removeMessage', { name }), t('common.delete'), t('common.cancel'));
    if (ok) remove(id);
  };

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.emergencyContacts')} />
      <AppText color="textSecondary" style={styles.intro}>{t('contacts.intro')}</AppText>

      {contacts.length === 0 && !adding ? (
        <EmptyState icon="people-outline" title={t('contacts.empty')} message={t('contacts.emptyHint')} />
      ) : (
        <View style={styles.list}>
          {contacts.map((c) => (
            <Card key={c.id}>
              <View style={styles.row}>
                <Avatar name={c.name} size={44} />
                <View style={styles.flex}>
                  <AppText variant="subheading">{c.name}</AppText>
                  <AppText color="textSecondary">{c.phone}</AppText>
                </View>
                <IconButton icon="call-outline" color="primary" accessibilityLabel={t('ride.call')} onPress={() => void Linking.openURL(`tel:${c.phone}`)} />
                <IconButton icon="trash-outline" color="danger" accessibilityLabel={t('common.delete')} onPress={() => confirmRemove(c.id, c.name)} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {adding ? (
        <Card style={styles.form}>
          <FormField control={control} name="name" label={t('auth.fullName')} leftIcon="person-outline" autoCapitalize="words" />
          <FormField control={control} name="phone" label={t('auth.phone')} leftIcon="call-outline" keyboardType="phone-pad" placeholder={t('auth.phonePlaceholder')} />
          <Button label={t('common.save')} onPress={save} />
          <Button label={t('common.cancel')} variant="ghost" onPress={() => setAdding(false)} />
        </Card>
      ) : contacts.length < MAX_CONTACTS ? (
        <Button label={t('contacts.add')} icon="person-add-outline" variant="secondary" onPress={() => setAdding(true)} style={styles.add} />
      ) : (
        <AppText variant="caption" color="textSecondary" style={styles.add}>{t('contacts.max', { count: MAX_CONTACTS })}</AppText>
      )}

      <SettingsSection>
        <SettingsSwitch icon="share-social-outline" label={t('settings.autoShareTrip')} value={autoShare} onValueChange={setAutoShare} />
      </SettingsSection>
      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { marginBottom: spacing.lg },
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  form: { marginTop: spacing.md, gap: spacing.xs },
  add: { marginTop: spacing.md },
});

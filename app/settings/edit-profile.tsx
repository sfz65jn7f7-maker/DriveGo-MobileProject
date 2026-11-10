import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useAuthStore } from '@/features/auth/auth.store';

export default function EditProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const save = async () => {
    await updateUser({ name: name.trim(), email: email.trim() || undefined });
    Alert.alert(t('settings.saved'));
    router.back();
  };

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.editProfile')} />
      <Input label={t('profile.name')} value={name} onChangeText={setName} leftIcon="person-outline" autoCapitalize="words" />
      <Input label={t('profile.email')} value={email} onChangeText={setEmail} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
      <Button label={t('common.save')} onPress={save} disabled={name.trim().length < 2} />
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/features/auth/auth.store';
import { ROUTES } from '@/constants/routes';

/** Avatar rond qui ouvre la page Profil. Une seule destination dans toute l'appli. */
export function HeaderAvatar({ size = 40 }: { size?: number }) {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  if (!user) return null;

  const href = activeRole === 'driver' ? ROUTES.driver.profile : ROUTES.passenger.profile;
  return (
    <Avatar
      name={user.name}
      uri={user.avatarUrl}
      size={size}
      onPress={() => router.push(href)}
      accessibilityLabel={t('profile.open')}
    />
  );
}

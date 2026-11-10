import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/auth.store';
import { useSettingsStore } from '@/features/settings/settings.store';
import { ROUTES } from '@/constants/routes';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);

  if (!user) {
    return <Redirect href={onboardingDone ? ROUTES.auth.login : ROUTES.onboarding.welcome} />;
  }
  if (activeRole === 'driver') {
    return (
      <Redirect
        href={user.driverStatus === 'approved' ? ROUTES.driver.dashboard : ROUTES.driver.pendingValidation}
      />
    );
  }
  return <Redirect href={ROUTES.passenger.home} />;
}
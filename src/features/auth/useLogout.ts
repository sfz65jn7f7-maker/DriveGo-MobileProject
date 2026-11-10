import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './auth.store';
import { authService } from '@/services/auth.service';

/** Confirmation compatible mobile (Alert) et web (window.confirm). */
function ask(title: string, message: string, confirmLabel: string, cancelLabel: string): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  return new Promise((resolve) =>
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    ),
  );
}

/** Déconnexion et suppression de compte, toujours avec confirmation. */
export function useLogout() {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const confirmLogout = useCallback(async () => {
    const ok = await ask(t('settings.logout'), t('settings.logoutConfirm'), t('common.logout'), t('common.cancel'));
    if (ok) await logout();
  }, [t, logout]);

  const confirmDelete = useCallback(async () => {
    const first = await ask(t('settings.deleteAccount'), t('settings.deleteConfirm1'), t('common.continue'), t('common.cancel'));
    if (!first) return;
    const second = await ask(t('settings.deleteAccount'), t('settings.deleteConfirm2'), t('common.delete'), t('common.cancel'));
    if (!second) return;
    await authService.deleteAccount();
    await logout();
  }, [t, logout]);

  return { confirmLogout, confirmDelete };
}
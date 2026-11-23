import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { setupNotifications } from './alerts';

/** Initialise les notifications et ouvre l'écran lié quand l'utilisateur touche une notification. */
export function useNotificationSetup() {
  const router = useRouter();
  useEffect(() => {
    if (Platform.OS === 'web') return;
    void setupNotifications();
    const open = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as never);
    };
    // App lancée en touchant une notification
    void Notifications.getLastNotificationResponseAsync().then(open).catch(() => undefined);
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [router]);
}

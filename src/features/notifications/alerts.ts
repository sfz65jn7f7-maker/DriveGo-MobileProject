import { AppState, Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, AndroidNotificationVisibility } from 'expo-notifications';
import { useSettingsStore } from '@/features/settings/settings.store';
import { notificationService } from '@/services/notification.service';
import { queryClient } from '@/services/queryClient';
import { useAlertStore } from './alert.store';
import { playAlertSound } from './sound';

export type AlertKind = 'ride' | 'message' | 'request';

/** Un canal Android par type : l'utilisateur peut régler chacun dans les réglages du téléphone. */
const CHANNELS: Record<AlertKind, { id: string; name: string; vibration: number[] }> = {
  ride: { id: 'rides', name: 'Courses', vibration: [0, 250, 150, 250] },
  request: { id: 'requests', name: 'Nouvelles demandes', vibration: [0, 400, 200, 400, 200, 400] },
  message: { id: 'messages', name: 'Messages', vibration: [0, 200] },
};

let ready = false;

/** À appeler une fois au démarrage : comportement en premier plan + canaux Android. */
export async function setupNotifications() {
  if (ready || Platform.OS === 'web') return;
  ready = true;
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const inApp = notification.request.content.data?.inApp === true;
      const sound = useSettingsStore.getState().notifications.sound;
      return {
        // App ouverte : la bannière in-app suffit, on garde le son et l'entrée dans le centre de notifications
        shouldShowBanner: !inApp,
        shouldShowList: true,
        shouldPlaySound: sound,
        shouldSetBadge: false,
      };
    },
  });
  if (Platform.OS === 'android') {
    await Promise.all(
      Object.values(CHANNELS).map((c) =>
        Notifications.setNotificationChannelAsync(c.id, {
          name: c.name,
          importance: AndroidImportance.MAX,
          sound: 'default',
          vibrationPattern: c.vibration,
          lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        }),
      ),
    );
  }
}

async function hasPermission() {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    // Ex. Expo Go sans module de notifications : on se contente de la bannière in-app
    return false;
  }
}

/** Le type d'alerte est-il activé dans Paramètres › Notifications ? */
function isEnabled(kind: AlertKind) {
  const { notifications, driverPrefs } = useSettingsStore.getState();
  if (kind === 'ride') return notifications.rides;
  if (kind === 'message') return notifications.messages;
  return driverPrefs.alertSound;
}

type AlertInput = { kind: AlertKind; title: string; body: string; url?: string };

/**
 * Alerte unique pour toute l'app :
 * - app ouverte → bannière in-app + son + vibration ;
 * - app en arrière-plan → notification système avec son ;
 * - ajout dans la liste « Notifications » (badge de la cloche).
 */
export async function notify({ kind, title, body, url }: AlertInput) {
  if (!isEnabled(kind)) return;
  const { notifications } = useSettingsStore.getState();
  const foreground = AppState.currentState === 'active';

  notificationService.add({ type: kind === 'message' ? 'system' : 'ride', title, body });
  void queryClient.invalidateQueries({ queryKey: ['notifications'] });

  if (foreground) {
    useAlertStore.getState().show({ kind, title, body, url });
    if (notifications.sound) {
      if (Platform.OS === 'web') playAlertSound(kind);
      else Vibration.vibrate(CHANNELS[kind].vibration);
    }
  }

  if (Platform.OS === 'web') {
    // Onglet en arrière-plan : notification du navigateur si elle a été autorisée
    if (!foreground && notifications.push && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    return;
  }

  if (!notifications.push) return;
  if (!(await hasPermission())) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: notifications.sound ? 'default' : undefined, data: { url, inApp: foreground } },
      trigger: Platform.OS === 'android' ? { channelId: CHANNELS[kind].id } : null,
    });
  } catch {
    // Notification système indisponible : la bannière in-app a déjà prévenu l'utilisateur.
  }
}

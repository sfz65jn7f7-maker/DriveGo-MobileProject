import { Alert, Linking, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useAuthStore } from '@/features/auth/auth.store';
import { useLogout } from '@/features/auth/useLogout';
import { useLocation } from '@/features/location/useLocation';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import type { NavigationApp } from '@/features/settings/settings.store';
import { ROUTES } from '@/constants/routes';
import { LANGUAGES } from '@/i18n';
import { spacing } from '@/theme';

const DISTANCES = [5, 10, 20, 50];
const NAV_APPS: NavigationApp[] = ['builtin', 'google', 'waze'];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const role = useAuthStore((s) => s.activeRole);
  const { status } = useLocation({ autoFetch: false });
  const { confirmLogout, confirmDelete } = useLogout();

  const themeMode = useSettingsStore((s) => s.themeMode);
  const language = useSettingsStore((s) => s.language);
  const currency = useSettingsStore((s) => s.currency);
  const distanceUnit = useSettingsStore((s) => s.distanceUnit);
  const autoShareTrip = useSettingsStore((s) => s.autoShareTrip);
  const setAutoShareTrip = useSettingsStore((s) => s.setAutoShareTrip);
  const defaultPayment = useSettingsStore((s) => s.defaultPayment);
  const setDefaultPayment = useSettingsStore((s) => s.setDefaultPayment);
  const driverPrefs = useSettingsStore((s) => s.driverPrefs);
  const setDriverPref = useSettingsStore((s) => s.setDriverPref);

  const themeLabel = { light: t('settings.themeLight'), dark: t('settings.themeDark'), system: t('settings.themeSystem') }[themeMode];
  const languageLabel = LANGUAGES.find((l) => l.code === language)?.label ?? language;
  const navLabel = (app: NavigationApp) =>
    app === 'builtin' ? t('settings.navBuiltin') : app === 'google' ? 'Google Maps' : 'Waze';
  const comingSoon = () => Alert.alert(t('common.comingSoon'));

  const cycle = <T,>(list: T[], current: T): T => list[(list.indexOf(current) + 1) % list.length];

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.title')} />

      <SettingsSection title={t('settings.sections.appearance')}>
        <SettingsRow icon="contrast-outline" label={t('settings.theme')} value={themeLabel} onPress={() => router.push(ROUTES.settings.appearance)} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.languageRegion')}>
        <SettingsRow icon="language-outline" label={t('settings.language')} value={languageLabel} onPress={() => router.push(ROUTES.settings.language)} />
        <SettingsRow icon="cash-outline" label={t('settings.currency')} value={currency} />
        <SettingsRow icon="speedometer-outline" label={t('settings.distanceUnit')} value={distanceUnit} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.notifications')}>
        <SettingsRow icon="notifications-outline" label={t('settings.sections.notifications')} onPress={() => router.push(ROUTES.settings.notifications)} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.location')}>
        <SettingsRow
          icon="location-outline"
          label={t('settings.locationPermission')}
          value={t(`settings.locationStatus.${status}`)}
          onPress={() => void Linking.openSettings()}
        />
        {role === 'driver' ? (
          <SettingsSwitch
            icon="navigate-outline"
            label={t('settings.backgroundTracking')}
            value={driverPrefs.backgroundTracking}
            onValueChange={(v) => setDriverPref('backgroundTracking', v)}
          />
        ) : null}
      </SettingsSection>

      <SettingsSection title={t('settings.sections.account')}>
        <SettingsRow icon="person-outline" label={t('settings.editProfile')} onPress={() => router.push(ROUTES.settings.editProfile)} />
        <SettingsRow icon="key-outline" label={t('settings.changePassword')} onPress={() => router.push(ROUTES.settings.security)} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.tripSafety')}>
        <SettingsRow icon="alert-circle-outline" label={t('settings.emergencyContacts')} onPress={() => router.push(ROUTES.settings.emergencyContacts)} />
        <SettingsSwitch icon="share-social-outline" label={t('settings.autoShareTrip')} value={autoShareTrip} onValueChange={setAutoShareTrip} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.payment')}>
        <SettingsRow icon="card-outline" label={t('settings.paymentMethods')} onPress={() => router.push(ROUTES.wallet)} />
        <SettingsRow
          icon="wallet-outline"
          label={t('settings.defaultPayment')}
          value={defaultPayment === 'cash' ? t('settings.paymentCash') : t('settings.paymentCard')}
          onPress={() => setDefaultPayment(defaultPayment === 'cash' ? 'card' : 'cash')}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.privacy')}>
        <SettingsRow icon="shield-checkmark-outline" label={t('settings.privacyData')} onPress={() => router.push(ROUTES.settings.privacy)} />
      </SettingsSection>

      {role === 'passenger' ? (
        <SettingsSection title={t('settings.sections.passenger')}>
          <SettingsRow icon="home-outline" label={t('settings.favoriteAddresses')} onPress={comingSoon} />
          <SettingsRow icon="options-outline" label={t('settings.tripPreferences')} onPress={comingSoon} />
        </SettingsSection>
      ) : null}

      {role === 'driver' ? (
        <SettingsSection title={t('settings.sections.driver')}>
          <SettingsRow
            icon="resize-outline"
            label={t('settings.maxDistance')}
            value={`${driverPrefs.maxDistanceKm} km`}
            onPress={() => setDriverPref('maxDistanceKm', cycle(DISTANCES, driverPrefs.maxDistanceKm))}
          />
          <SettingsSwitch
            icon="volume-high-outline"
            label={t('settings.newRequestAlert')}
            value={driverPrefs.alertSound}
            onValueChange={(v) => setDriverPref('alertSound', v)}
          />
          <SettingsRow
            icon="map-outline"
            label={t('settings.defaultNavigation')}
            value={navLabel(driverPrefs.navigationApp)}
            onPress={() => setDriverPref('navigationApp', cycle(NAV_APPS, driverPrefs.navigationApp))}
          />
          <SettingsRow icon="document-text-outline" label={t('profile.documents')} onPress={() => router.push(ROUTES.driver.documents)} />
        </SettingsSection>
      ) : null}

      <SettingsSection title={t('settings.sections.help')}>
        <SettingsRow icon="help-circle-outline" label={t('settings.support')} onPress={() => router.push(ROUTES.help)} />
        <SettingsRow
          icon="information-circle-outline"
          label={t('settings.about')}
          value={`v${Constants.expoConfig?.version ?? '1.0.0'}`}
          onPress={() => router.push(ROUTES.settings.about)}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.danger')}>
        <SettingsRow icon="log-out-outline" label={t('settings.logout')} destructive onPress={confirmLogout} />
        <SettingsRow icon="trash-outline" label={t('settings.deleteAccount')} destructive onPress={confirmDelete} />
      </SettingsSection>
      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

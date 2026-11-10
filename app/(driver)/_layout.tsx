import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tabIcon } from '@/components/common/tabIcon';
import { useTabScreenOptions } from '@/hooks/useTabScreenOptions';

export default function DriverTabs() {
  const { t } = useTranslation();
  const screenOptions = useTabScreenOptions();
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="dashboard" options={{ title: t('tabs.dashboard'), tabBarIcon: tabIcon('speedometer', 'speedometer-outline') }} />
      <Tabs.Screen name="requests" options={{ title: t('tabs.requests'), tabBarIcon: tabIcon('list', 'list-outline') }} />
      <Tabs.Screen name="earnings" options={{ title: t('tabs.earnings'), tabBarIcon: tabIcon('cash', 'cash-outline') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon('person', 'person-outline') }} />
      {/* Écrans accessibles mais absents de la barre du bas */}
      <Tabs.Screen name="documents" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tabIcon } from '@/components/common/tabIcon';
import { useTabScreenOptions } from '@/hooks/useTabScreenOptions';

export default function PassengerTabs() {
  const { t } = useTranslation();
  const screenOptions = useTabScreenOptions();
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home'), tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen name="carpool" options={{ title: t('tabs.carpool'), tabBarIcon: tabIcon('people', 'people-outline') }} />
      <Tabs.Screen name="activity" options={{ title: t('tabs.activity'), tabBarIcon: tabIcon('time', 'time-outline') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon('person', 'person-outline') }} />
    </Tabs>
  );
}

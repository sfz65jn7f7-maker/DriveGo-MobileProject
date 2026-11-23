import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SeatSelector } from '@/components/carpool/SeatSelector';
import { carpoolSearchSchema } from '@/features/carpool';
import type { CarpoolSearchForm } from '@/features/carpool';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';
import { formatDay, nextDays } from '@/utils/date';

const POPULAR = [
  { from: 'Casablanca', to: 'Rabat' },
  { from: 'Casablanca', to: 'Marrakech' },
  { from: 'Tanger', to: 'Casablanca' },
];

export default function CarpoolSearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [date, setDate] = useState('any');
  const [seats, setSeats] = useState(1);
  const { control, handleSubmit, setValue, getValues } = useForm<CarpoolSearchForm>({
    resolver: zodResolver(carpoolSearchSchema),
    defaultValues: { from: '', to: '' },
  });

  const [days] = useState(() => nextDays(7));
  const dateOptions = [
    { value: 'any', label: t('carpool.anyDate') },
    ...days.map((d, i) => ({
      value: d.toISOString(),
      label: i === 0 ? t('carpool.today') : i === 1 ? t('carpool.tomorrow') : formatDay(d.toISOString(), i18n.language),
    })),
  ];

  const search = (values: CarpoolSearchForm) =>
    router.push({
      pathname: ROUTES.carpool.results,
      params: { from: values.from.trim(), to: values.to.trim(), date: date === 'any' ? '' : date, seats: String(seats) },
    });

  const swap = () => {
    const { from, to } = getValues();
    setValue('from', to);
    setValue('to', from);
  };

  const field = (name: 'from' | 'to', label: string, icon: 'radio-button-on-outline' | 'flag-outline') => (
    <Controller
      control={control}
      name={name}
      render={({ field: f, fieldState }) => (
        <Input
          label={label}
          leftIcon={icon}
          placeholder={t('carpool.cityPlaceholder')}
          value={f.value}
          onChangeText={f.onChange}
          onBlur={f.onBlur}
          autoCapitalize="words"
          error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
        />
      )}
    />
  );

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.carpoolSearch')} />

      <View>
        {field('from', t('carpool.from'), 'radio-button-on-outline')}
        <View style={styles.swap}>
          <IconButton icon="swap-vertical" variant="floating" color="primary" accessibilityLabel={t('carpool.swap')} onPress={swap} />
        </View>
        {field('to', t('carpool.to'), 'flag-outline')}
      </View>

      <AppText variant="label" color="textSecondary">{t('carpool.date')}</AppText>
      <ChipGroup options={dateOptions} value={date} onChange={setDate} />

      <View style={styles.seats}>
        <AppText variant="label" color="textSecondary">{t('carpool.passengers')}</AppText>
        <SeatSelector value={seats} onChange={setSeats} />
      </View>

      <Button label={t('carpoolTab.search')} icon="search" onPress={handleSubmit(search)} />

      <AppText variant="label" color="textSecondary" style={styles.popularTitle}>{t('carpool.popular')}</AppText>
      <View style={styles.popular}>
        {POPULAR.map((p) => (
          <Button
            key={`${p.from}-${p.to}`}
            label={`${p.from} → ${p.to}`}
            variant="secondary"
            onPress={() => search({ from: p.from, to: p.to })}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  swap: { position: 'absolute', end: spacing.sm, top: 58, zIndex: 1 },
  seats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.lg },
  popularTitle: { marginTop: spacing.xl, marginBottom: spacing.sm },
  popular: { gap: spacing.sm, paddingBottom: spacing.xl },
});

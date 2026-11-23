import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SeatSelector } from '@/components/carpool/SeatSelector';
import { publishTripSchema, usePublishTrip } from '@/features/carpool';
import type { PublishTripForm, PublishTripValues } from '@/features/carpool';
import { useAuthStore } from '@/features/auth/auth.store';
import { CARPOOL_RULES } from '@/services/mocks/carpool';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';
import { formatDay, nextDays } from '@/utils/date';
import { notify } from '@/utils/dialog';

/** Date de départ à partir du jour choisi et de l'heure « HH:MM ». */
function departureFrom(day: string, time: string) {
  const [h, m] = time.split(':').map(Number);
  const departure = new Date(day);
  departure.setHours(h, m, 0, 0);
  return departure;
}

export default function PublishTripScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const publish = usePublishTrip();
  const [days] = useState(() => nextDays(7));
  const [day, setDay] = useState(() => days[0].toISOString());
  const [seats, setSeats] = useState(3);
  const [rules, setRules] = useState<string[]>(['noSmoking']);
  const [pastError, setPastError] = useState(false);

  const { control, handleSubmit } = useForm<PublishTripForm, unknown, PublishTripValues>({
    resolver: zodResolver(publishTripSchema),
    defaultValues: { from: '', to: '', time: '08:00', price: '50' },
  });

  const toggleRule = (rule: string) =>
    setRules((list) => (list.includes(rule) ? list.filter((r) => r !== rule) : [...list, rule]));

  const submit = handleSubmit(async (values) => {
    const departure = departureFrom(day, values.time);
    if (departure < new Date()) {
      setPastError(true);
      return;
    }
    setPastError(false);
    await publish.mutateAsync({
      input: {
        from: values.from.trim(),
        to: values.to.trim(),
        departureAt: departure.toISOString(),
        seats,
        pricePerSeat: values.price,
        rules,
      },
      driver: user,
    });
    notify(t('carpool.publishedTitle'), t('carpool.publishedMessage'));
    router.replace(ROUTES.carpool.myTrips);
  });

  const text = (name: 'from' | 'to' | 'time' | 'price', label: string, props: Partial<React.ComponentProps<typeof Input>>) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          label={label}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
          {...props}
        />
      )}
    />
  );

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.publishTrip')} />

      {text('from', t('carpool.from'), { leftIcon: 'radio-button-on-outline', placeholder: t('carpool.cityPlaceholder'), autoCapitalize: 'words' })}
      {text('to', t('carpool.to'), { leftIcon: 'flag-outline', placeholder: t('carpool.cityPlaceholder'), autoCapitalize: 'words' })}

      <AppText variant="label" color="textSecondary">{t('carpool.date')}</AppText>
      <ChipGroup
        value={day}
        onChange={setDay}
        options={days.map((d, i) => ({
          value: d.toISOString(),
          label: i === 0 ? t('carpool.today') : i === 1 ? t('carpool.tomorrow') : formatDay(d.toISOString(), i18n.language),
        }))}
      />

      <View style={styles.row}>
        <View style={styles.flex}>
          {text('time', t('carpool.time'), { leftIcon: 'time-outline', placeholder: '08:00', keyboardType: 'numbers-and-punctuation', maxLength: 5 })}
        </View>
        <View style={styles.flex}>
          {text('price', t('carpool.pricePerSeat'), { leftIcon: 'cash-outline', keyboardType: 'number-pad', maxLength: 4 })}
        </View>
      </View>
      {pastError ? <AppText variant="caption" color="danger" style={styles.error}>{t('carpool.errors.past')}</AppText> : null}

      <View style={styles.seats}>
        <AppText variant="label" color="textSecondary">{t('carpool.seatsOffered')}</AppText>
        <SeatSelector value={seats} max={6} onChange={setSeats} />
      </View>

      <AppText variant="label" color="textSecondary" style={styles.label}>{t('carpool.rulesTitle')}</AppText>
      <View style={styles.rules}>
        {CARPOOL_RULES.map((r) => (
          <Chip key={r} label={t(`carpool.rules.${r}`)} selected={rules.includes(r)} onPress={() => toggleRule(r)} />
        ))}
      </View>

      <Button label={t('carpool.publishButton')} icon="paper-plane-outline" onPress={submit} loading={publish.isPending} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  error: { marginTop: -spacing.sm, marginBottom: spacing.sm },
  seats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { marginTop: spacing.lg, marginBottom: spacing.sm },
  rules: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  submit: { marginVertical: spacing.xl },
});

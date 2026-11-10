import { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/common/Screen';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Logo } from '@/components/brand/Logo';
import { ROUTES } from '@/constants/routes';
import { layout, radius, spacing, useTheme } from '@/theme';

const SLIDES = [
  { key: 'slide1', icon: 'cash-outline' },
  { key: 'slide2', icon: 'navigate-outline' },
  { key: 'slide3', icon: 'people-outline' },
] as const;

export default function Welcome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const pageWidth = Math.min(width, layout.maxContentWidth) - layout.screenPadding * 2;
  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));

  const goNext = () => {
    if (isLast) router.push(ROUTES.onboarding.permissions);
    else listRef.current?.scrollToIndex({ index: index + 1 });
  };

  return (
    <Screen>
      <View style={styles.top}>
        <Logo size={44} />
        <ThemeToggle />
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        getItemLayout={(_, i) => ({ length: pageWidth, offset: pageWidth * i, index: i })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: pageWidth }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
              <Ionicons name={item.icon} size={72} color={colors.primary} />
            </View>
            <AppText variant="title" style={styles.center}>
              {t(`onboarding.${item.key}Title`)}
            </AppText>
            <AppText color="textSecondary" style={styles.center}>
              {t(`onboarding.${item.key}Desc`)}
            </AppText>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View
            key={s.key}
            style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.border, width: i === index ? 24 : 8 }]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button label={isLast ? t('common.start') : t('common.next')} onPress={goNext} />
        {!isLast ? (
          <Button label={t('common.skip')} variant="ghost" onPress={() => router.push(ROUTES.onboarding.permissions)} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: layout.headerHeight },
  slide: { alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.md },
  iconWrap: { width: 160, height: 160, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  center: { textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  dot: { height: 8, borderRadius: 4 },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});

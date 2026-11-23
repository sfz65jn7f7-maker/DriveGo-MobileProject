import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/common/Loader';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useMessages, useSendMessage } from '@/features/chat';
import { fontSize, layout, radius, spacing, useTheme } from '@/theme';
import { formatTime } from '@/utils/date';

const QUICK_REPLIES = ['chat.quick1', 'chat.quick2', 'chat.quick3'];

export default function ChatScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { data: messages, isLoading } = useMessages(id);
  const send = useSendMessage(id);
  const [text, setText] = useState('');

  const submit = (value = text) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    send.mutate(trimmed);
    setText('');
  };

  // Liste inversée : le dernier message est en bas, au-dessus du clavier
  const data = [...(messages ?? [])].reverse();

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader title={name || t('screens.chat')} />
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            inverted
            data={data}
            keyExtractor={(m) => m.id}
            contentContainerStyle={[styles.padded, styles.list]}
            renderItem={({ item }) => {
              const mine = item.from === 'me';
              return (
                <View
                  style={[
                    styles.bubble,
                    mine
                      ? [styles.mine, { backgroundColor: colors.primary }]
                      : [styles.theirs, { backgroundColor: colors.surface, borderColor: colors.border }],
                  ]}
                >
                  <AppText color={mine ? 'onPrimary' : 'text'}>{item.text}</AppText>
                  <AppText variant="caption" color={mine ? 'onPrimary' : 'textSecondary'} style={styles.time}>
                    {formatTime(item.createdAt, i18n.language)}
                  </AppText>
                </View>
              );
            }}
          />
        )}

        <View style={[styles.quick, styles.padded]}>
          {QUICK_REPLIES.map((key) => (
            <Pressable
              key={key}
              onPress={() => submit(t(key))}
              style={[styles.quickChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
              accessibilityRole="button"
            >
              <AppText variant="caption">{t(key)}</AppText>
            </Pressable>
          ))}
        </View>

        <View style={[styles.composer, styles.padded, { borderTopColor: colors.border }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('chat.placeholder')}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            multiline
            maxLength={500}
            onSubmitEditing={() => submit()}
          />
          <Pressable
            onPress={() => submit()}
            disabled={!text.trim()}
            accessibilityRole="button"
            accessibilityLabel={t('chat.send')}
            style={[styles.send, { backgroundColor: text.trim() ? colors.primary : colors.border }]}
          >
            <Ionicons name="send" size={18} color={colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { paddingHorizontal: layout.screenPadding },
  list: { gap: spacing.sm, paddingVertical: spacing.md },
  bubble: { maxWidth: '80%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  mine: { alignSelf: 'flex-end', borderBottomEndRadius: 4 },
  theirs: { alignSelf: 'flex-start', borderBottomStartRadius: 4, borderWidth: StyleSheet.hairlineWidth },
  time: { marginTop: 2, opacity: 0.8, alignSelf: 'flex-end' },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, paddingBottom: spacing.sm },
  quickChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, borderWidth: 1 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, minHeight: 44, maxHeight: 120, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 12, borderRadius: 22, fontSize: fontSize.md },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

import * as SecureStore from 'expo-secure-store';

/** Stockage sécurisé (tokens, session). Les préférences passent par AsyncStorage. */
export const secureStorage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
};

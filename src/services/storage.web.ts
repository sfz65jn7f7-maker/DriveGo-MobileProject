const memory = new Map<string, string>();

const local = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

export const secureStorage = {
  get: async (key: string): Promise<string | null> => local()?.getItem(key) ?? memory.get(key) ?? null,
  set: async (key: string, value: string): Promise<void> => {
    const store = local();
    if (store) store.setItem(key, value);
    else memory.set(key, value);
  },
  remove: async (key: string): Promise<void> => {
    local()?.removeItem(key);
    memory.delete(key);
  },
};
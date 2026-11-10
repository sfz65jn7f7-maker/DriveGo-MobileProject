/** Simule la latence réseau des appels mockés. */
export const delay = (ms = 500) => new Promise<void>((resolve) => setTimeout(resolve, ms));

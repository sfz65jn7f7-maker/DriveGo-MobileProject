/**
 * Mobile : le son est joué par la notification locale (son système du canal Android / iOS),
 * voir alerts.ts. Rien à faire ici ; ce fichier existe pour la version web (sound.web.ts).
 */
export function playAlertSound(_kind: 'ride' | 'message' | 'request') {}

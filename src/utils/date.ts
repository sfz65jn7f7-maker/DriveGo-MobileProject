/** Date ISO dans n jours, à l'heure donnée (heure locale). */
export function inDays(days: number, hour = 8, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Date ISO il y a n minutes. */
export const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Libellé court d'un jour : « lun. 24 » */
export const formatDay = (iso: string, locale = 'fr') =>
  new Date(iso).toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });

export const formatTime = (iso: string, locale = 'fr') =>
  new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

/** Les 7 prochains jours à partir d'aujourd'hui (minuit). */
export function nextDays(count = 7): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Jour de la semaine abrégé, sans point final : « lun », « mar »… */
export const formatWeekday = (iso: string, locale = 'fr') =>
  new Date(iso).toLocaleDateString(locale, { weekday: 'short' }).replace(/\.$/, '');

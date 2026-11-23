/** Web : petit « ding-dong » généré avec Web Audio (aucun fichier son nécessaire). */
let ctx: AudioContext | null = null;

export function playAlertSound(kind: 'ride' | 'message' | 'request') {
  try {
    ctx ??= new AudioContext();
    const notes = kind === 'request' ? [880, 1175, 880, 1175] : kind === 'message' ? [988] : [784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      const start = ctx!.currentTime + i * 0.18;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  } catch {
    // Navigateur sans Web Audio, ou son bloqué avant la première interaction : on ignore.
  }
}

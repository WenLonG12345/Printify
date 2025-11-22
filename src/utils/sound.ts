/** biome-ignore-all lint/suspicious/noExplicitAny: reason */
export const playPrintSound = () => {
	try {
		const AudioContext =
			window.AudioContext || (window as any).webkitAudioContext;
		if (!AudioContext) return;

		const ctx = new AudioContext();
		const t = ctx.currentTime;

		// 1. Primary Tone (Fundamental)
		const osc1 = ctx.createOscillator();
		const gain1 = ctx.createGain();

		osc1.type = "sine";
		osc1.frequency.setValueAtTime(880, t); // A5

		gain1.gain.setValueAtTime(0, t);
		gain1.gain.linearRampToValueAtTime(0.3, t + 0.02);
		gain1.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Long decay

		osc1.connect(gain1);
		gain1.connect(ctx.destination);

		// 2. Overtone (Sparkle)
		const osc2 = ctx.createOscillator();
		const gain2 = ctx.createGain();

		osc2.type = "sine";
		osc2.frequency.setValueAtTime(1760, t); // A6

		gain2.gain.setValueAtTime(0, t);
		gain2.gain.linearRampToValueAtTime(0.1, t + 0.02);
		gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.5); // Short decay

		osc2.connect(gain2);
		gain2.connect(ctx.destination);

		osc1.start(t);
		osc2.start(t);

		osc1.stop(t + 1.6);
		osc2.stop(t + 1.6);
	} catch (e) {
		console.error("Audio play failed", e);
	}
};

export const playTypeSound = () => {
	try {
		const AudioContext =
			window.AudioContext || (window as any).webkitAudioContext;
		if (!AudioContext) return;

		const ctx = new AudioContext();
		const t = ctx.currentTime;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		// Randomize pitch slightly for natural feel
		const pitch = 600 + Math.random() * 200;

		osc.type = "sine";
		osc.frequency.setValueAtTime(pitch, t);

		// Very short envelope for a "click"
		gain.gain.setValueAtTime(0.05, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(t);
		osc.stop(t + 0.06);
	} catch (e) {
		console.error("Audio play failed", e);
	}
};

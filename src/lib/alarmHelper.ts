/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let alarmInterval: any = null;

export function playAlarmSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Clear any existing active sound interval
    if (alarmInterval) {
      clearInterval(alarmInterval);
    }

    // Play a dual-tone pulsating alert sound
    alarmInterval = setInterval(() => {
      if (!audioCtx) return;
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // High alarm beep

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime); // Low support frequency

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      
      osc1.stop(audioCtx.currentTime + 0.5);
      osc2.stop(audioCtx.currentTime + 0.5);
    }, 700);

  } catch (error) {
    console.error("Audio Context is blocked or not supported:", error);
  }
}

export function stopAlarmSound() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

/**
 * Cockpit Audio Announcer Engine
 * Synthesizes cockpit chimes via Web Audio API + natural voice alerts via Web Speech API
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a clean dual-tone cockpit attention chime
 */
export function playCockpitChime(type = 'waypoint') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    if (type === 'sos') {
      // Urgent high alarm
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(440, now + 0.15);
      osc1.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc1.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);
      return;
    }

    // Default friendly dual-tone cockpit chime (587Hz D5 -> 880Hz A5)
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.55);
  } catch (err) {
    console.warn('Could not play synthesized cockpit chime:', err);
  }
}

/**
 * Speaks an automated highway waypoint announcement using Web Speech API
 */
export function speakAnnouncement(text, enabled = true) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // 1. Play auditory chime first
    playCockpitChime('waypoint');

    // 2. Speak message after short chime delay
    setTimeout(() => {
      window.speechSynthesis.cancel(); // Stop previous ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.02;
      utterance.lang = 'en-IN'; // Indian English voice preferred

      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('IN')) ||
                      voices.find(v => v.lang.startsWith('en')) ||
                      voices[0];

      if (inVoice) {
        utterance.voice = inVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, 450);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export default {
  playCockpitChime,
  speakAnnouncement
};

export function speechSynthesis(textToSpeech: string) {
  if (!window || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  if (!synth) return;

  if (synth.speaking) {
    synth.pause();
    synth.cancel();
    return;
  }

  const voice =
    window.speechSynthesis
      .getVoices()
      .filter((ssv) => ssv.lang.includes(Intl.DateTimeFormat().resolvedOptions().locale))[0] ??
    window.speechSynthesis.getVoices()[0];

  if (!voice) return;

  if (!textToSpeech) return;

  const utterance = new SpeechSynthesisUtterance(textToSpeech);
  if (!utterance) return;

  utterance.voice = voice;
  utterance.pitch = 0.95;
  utterance.rate = 1.1;
  utterance.volume = 1;

  synth.speak(utterance);
}

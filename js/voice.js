// Made by tools/make-voice.mjs: the recorded voice clips, played instead of the device voice.
// Loaded by the page (fills CONTENT.voiceFiles) and by sw.js (saves the clips for offline use).
(function () {
  const ids = [];
  self.VOICE_FILES = ids.map(id => 'audio/voice/' + id + '.mp3');
  if (self.CONTENT) ids.forEach((id, i) => { self.CONTENT.voiceFiles[id] = self.VOICE_FILES[i]; });
})();

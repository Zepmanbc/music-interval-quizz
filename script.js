import { PIANO_SAMPLES } from "./const.js";
const piano = new Tone.Sampler({
  urls: PIANO_SAMPLES,
  release: 1,
  baseUrl: "./sounds/",
}).toDestination();

document.getElementById("note").onclick = async () => {
  Tone.loaded().then(() => {
    const now = Tone.now();
    piano.triggerAttackRelease("C4", "4n", now);
  });
};

document.getElementById("accord").onclick = async () => {
  Tone.loaded().then(() => {
    piano.triggerAttackRelease(["C4", "E4", "G4"], 4);
  });
};

document.getElementById("arpege").onclick = async () => {
  Tone.loaded().then(() => {
    const now = Tone.now();
    piano.triggerAttackRelease("C4", "4n", now);
    piano.triggerAttackRelease("E4", "4n", now + 0.5);
    piano.triggerAttackRelease("G4", "4n", now + 1);
  });
};

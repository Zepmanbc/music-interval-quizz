import { PIANO_SAMPLES } from "./const.js";

const INCREMENT = 0.5;

const piano = new Tone.Sampler({
  urls: PIANO_SAMPLES,
  release: 1,
  baseUrl: "./sounds/",
}).toDestination();

function playNotes(notes) {
  Tone.loaded().then(() => {
    const now = Tone.now();
    let delta = 0;
    for (const note of notes) {
      piano.triggerAttackRelease(note, "4n", now + delta);
      delta += INCREMENT;
    }
  });
}

function playChord(notes) {
  Tone.loaded().then(() => {
    piano.triggerAttackRelease(notes, 4);
  });
}

document.getElementById("note").onclick = async () => {
  Tone.loaded().then(() => {
    playNotes(["C4"]);
  });
};

document.getElementById("accord").onclick = async () => {
  playChord(["C4", "E4", "G4"]);
};

document.getElementById("arpege").onclick = async () => {
  Tone.loaded().then(() => {
    const now = Tone.now();
    playNotes(["C4", "E4", "G4"]);
  });
};

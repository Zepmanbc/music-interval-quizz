export const NOTES_INDEX = {
  Cbb: 10,
  Cb: 11,
  C: 0,
  "C#": 1,
  "C##": 2,
  Dbb: 0,
  Db: 1,
  D: 2,
  "D#": 3,
  "D##": 4,
  Ebb: 2,
  Eb: 3,
  E: 4,
  "E#": 5,
  "E##": 6,
  Fbb: 3,
  Fb: 4,
  F: 5,
  "F#": 6,
  "F##": 7,
  Gbb: 5,
  Gb: 6,
  G: 7,
  "G#": 8,
  "G##": 9,
  Abb: 7,
  Ab: 8,
  A: 9,
  "A#": 10,
  "A##": 11,
  Bbb: 9,
  Bb: 10,
  B: 11,
  "B#": 0,
  "B##": 1,
};

export const NOTES_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
export const STARTING_NOTES = [
  "Ab",
  "A",
  "A#",
  "B",
  // "B#",
  "Bb",
  "C",
  "Cb",
  "C#",
  "D",
  "D#",
  "Db",
  "D#",
  "E",
  "E#",
  "Eb",
  "F",
  // "Fb",
  "F#",
  "G",
  "Gb",
  "G#",
];

export function getRandomNote() {
  const index = Math.floor(Math.random() * STARTING_NOTES.length);
  return STARTING_NOTES[index];
}

export function getRandomOption(options) {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

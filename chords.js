export const CHORDS_OPTIONS = ["3 sons", "4 sons"];
const CHORDS_3 = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
};
const CHORDS_4 = {
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  Dom7: [0, 4, 7, 10],
  demiDim: [0, 3, 6, 10],
  maj6: [0, 4, 7, 9],
  min6: [0, 3, 7, 9],
};

export function setupChordsQuizz(options) {
  return {
    startingNote: "C",
    interval: "",
    direction: "",
    secondNote: "",
    notesToPlay: ["C3", "E3", "G3"],
    interface: () => {
      let interfaceDiv = document.createElement("div");
      interfaceDiv.innerHTML = "Chrods<br>Work in progress";
      return interfaceDiv;
    },
    checkResponse: () => {},
    settings: document.createElement("div"),
  };
}

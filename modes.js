export const MODES_OPTIONS = ["Ascendant", "Descendant"];
const SCALE_MODES = {
  ionien: [0, 2, 4, 5, 7, 9, 11, 12],
  dorien: [0, 2, 3, 5, 7, 9, 10, 12],
  phrygien: [0, 1, 3, 5, 7, 8, 10, 12],
  lydien: [0, 2, 4, 6, 7, 9, 11, 12],
  mixolydien: [0, 2, 4, 5, 7, 9, 10, 12],
  aeolien: [0, 2, 3, 5, 7, 8, 10, 12],
  locrien: [0, 1, 3, 5, 6, 8, 1, 120],
};

export function setupModesQuizz(options) {
  return {
    startingNote: "C",
    interval: "",
    direction: "",
    secondNote: "",
    notesToPlay: ["C3", "D3", "E3", "F3", "G3", "A4", "B4", "C4"],
    interface: () => {
      let interfaceDiv = document.createElement("div");
      interfaceDiv.innerHTML = "Modes<br>Work in progress";
      return interfaceDiv;
    },
    checkResponse: () => {},
    settings: document.createElement("div"),
  };
}

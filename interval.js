import {
  ALTERATIONS_NAMES,
  NOTES_INDEX,
  NOTES_NAMES,
  getRandomNote,
  getRandomOption,
} from "./common.js";

import { convertPlayingNote } from "./piano.js";

export const INTERVALS = {
  P1: 0,
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  P4: 5,
  TT: 6,
  P5: 7,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
  P8: 12,
};

const INTERVAL_NOTE_NAME = {
  P1: 0,
  m2: 1,
  M2: 1,
  m3: 2,
  M3: 2,
  P4: 3,
  TT: 3,
  P5: 4,
  m6: 5,
  M6: 5,
  m7: 6,
  M7: 6,
  P8: 7,
};

export function setupIntervalQuizz(options) {
  let startingNote = getRandomNote();
  let interval = getRandomInterval();
  let direction = getRandomOption(options);
  // Force config
  // startingNote = "C";
  // interval = "P8";
  // direction = "Ascendant";
  const secondNote = getSecondNote(startingNote, interval, direction);
  const playingNote1 = getInitialNoteToPlay(startingNote);
  const playingNote2 = getSecondNoteToPlay(
    playingNote1,
    secondNote,
    interval,
    direction,
  );
  console.log(
    `Interval ${direction}: ${startingNote} ${interval} => ${secondNote} - [${playingNote1}-${playingNote2}]`,
  );
  return {
    startingNote: startingNote,
    interval: interval,
    direction: direction,
    secondNote: secondNote,
    notesToPlay: [playingNote1, playingNote2],
    interface: interfaceResponseBtns,
  };
}

function getRandomInterval() {
  const intervals = Object.keys(INTERVALS);
  const index = Math.floor(Math.random() * intervals.length);
  return intervals[index];
}

function getSecondNote(startingNote, interval, direction) {
  const nextNoteName = getNextNoteName(startingNote, interval, direction);
  const intervalQty = INTERVALS[interval];

  const startingNoteIndex = NOTES_INDEX[startingNote];

  let secondNoteIndex;
  if (direction == "Ascendant") {
    secondNoteIndex = (startingNoteIndex + intervalQty) % 12;
  } else {
    secondNoteIndex = (startingNoteIndex + 12 - intervalQty) % 12;
  }

  const result = Object.keys(NOTES_INDEX).find(
    (key) =>
      key.startsWith(nextNoteName) && NOTES_INDEX[key] === secondNoteIndex,
  );

  return result;
}

function getNextNoteName(startingNote, interval, direction) {
  let targetNoteIndex;
  const startingNoteName = startingNote[0];
  const startingNoteNameIndex = NOTES_NAMES.indexOf(startingNoteName);
  const stepToNextNote = INTERVAL_NOTE_NAME[interval];
  if (direction == "Ascendant") {
    targetNoteIndex = startingNoteNameIndex + stepToNextNote;
  } else {
    targetNoteIndex = startingNoteNameIndex + 7 - stepToNextNote;
  }
  return NOTES_NAMES[targetNoteIndex % 7];
}

function getInitialNoteToPlay(note) {
  return convertPlayingNote(note) + "4";
}

function getSecondNoteToPlay(playingNote, secondNote, interval, direction) {
  if (interval == "P1") {
    return playingNote;
  }
  const convertedNote = convertPlayingNote(secondNote);
  if (direction == "Ascendant") {
    if (interval == "P8") {
      return convertedNote + "5";
    }
    if (playingNote[0] < convertedNote[0]) {
      return convertedNote + "4";
    } else {
      return convertedNote + "5";
    }
  } else {
    if (interval == "P8") {
      return convertedNote + "3";
    }
    if (playingNote[0] < convertedNote[0]) {
      return convertedNote + "3";
    } else {
      return convertedNote + "4";
    }
  }
}

// interface
function interfaceResponseBtns() {
  let interfaceDiv = document.createElement("div");
  interfaceDiv.appendChild(intervalsBtns());
  interfaceDiv.appendChild(notessBtns());
  interfaceDiv.appendChild(alterationBtns());
  return interfaceDiv;
}

function intervalsBtns() {
  const result = document.createElement("div");
  const title = document.createElement("div");
  title.classList.add("response-label");
  title.textContent = "Interval";
  result.appendChild(title);

  const intervalsDiv = document.createElement("div");
  intervalsDiv.classList.add("intervales-grid");
  // intervalsDiv.classList.add("response-button");
  Object.keys(INTERVALS).forEach((interval) => {
    const btn = document.createElement("button");
    btn.innerText = interval;

    // btn.onclick = () => {
    //   // ✅ on stocke la réponse
    //   selectedNote = note;

    //   console.log("Note sélectionnée :", selectedNote);

    //   // ✅ reset visuel (une seule sélection)
    //   [...intervalsDiv.querySelectorAll("button")].forEach((b) =>
    //     b.classList.remove("selected"),
    //   );

    //   btn.classList.add("selected");
    // };
    intervalsDiv.appendChild(btn);
  });
  result.appendChild(intervalsDiv);
  return result;
}
function notessBtns() {
  const result = document.createElement("div");
  const title = document.createElement("div");
  title.classList.add("response-label");
  title.textContent = "Note";
  result.appendChild(title);

  const notesDiv = document.createElement("div");
  notesDiv.classList.add("notes-grid");
  // notesDiv.classList.add("response-button");
  NOTES_NAMES.forEach((note) => {
    const btn = document.createElement("button");
    btn.innerText = note;

    // btn.onclick = () => {
    //   // ✅ on stocke la réponse
    //   selectedNote = note;

    //   console.log("Note sélectionnée :", selectedNote);

    //   // ✅ reset visuel (une seule sélection)
    //   [...notesDiv.querySelectorAll("button")].forEach((b) =>
    //     b.classList.remove("selected"),
    //   );

    //   btn.classList.add("selected");
    // };
    notesDiv.appendChild(btn);
  });

  result.appendChild(notesDiv);
  return result;
}
function alterationBtns() {
  const result = document.createElement("div");
  const title = document.createElement("div");
  title.classList.add("response-label");
  title.textContent = "Altération";
  result.appendChild(title);

  const alterationsDiv = document.createElement("div");
  alterationsDiv.classList.add("alterations-grid");
  ALTERATIONS_NAMES.forEach((note) => {
    const btn = document.createElement("button");
    btn.innerText = note;

    // btn.onclick = () => {
    //   // ✅ on stocke la réponse
    //   selectedNote = note;

    //   console.log("Note sélectionnée :", selectedNote);

    //   // ✅ reset visuel (une seule sélection)
    //   [...alterationsDiv.querySelectorAll("button")].forEach((b) =>
    //     b.classList.remove("selected"),
    //   );

    //   btn.classList.add("selected");
    // };
    alterationsDiv.appendChild(btn);
  });
  result.appendChild(alterationsDiv);
  return result;
}

// DATA
const INTERVALS = [
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "TT",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
  "P8",
];
const NOTES_GROUP = [
  ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"],
  ["A", "B", "C", "D", "E", "F", "G"],
  ["A#", "B#", "C#", "D#", "E#", "F#", "G#"],
];

// SOUND
function noteToFrequency(note, octave = 4) {
  const A4 = 440;
  const semitoneIndex = NOTE_INDEX[note];

  const semitonesFromA4 = semitoneIndex - NOTE_INDEX["A"] + (octave - 4) * 12;

  return A4 * Math.pow(2, semitonesFromA4 / 12);
}

function transposeFrequency(freq, semitones) {
  return freq * Math.pow(2, semitones / 12);
}

function playFrequency(freq, delay = 0, duration = 1) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const t = audioCtx.currentTime + delay;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
  gain.gain.linearRampToValueAtTime(0, t + duration);

  osc.start(t);
  osc.stop(t + duration);
}

function playFrequencies(freqs, playStyle, direction) {
  const noteDuration = 1;
  const gapBetweenNotes = 0.1;
  if (playStyle === "chord") {
    freqs.forEach((freq) => playFrequency(freq, 0, noteDuration));
    return noteDuration;
  } else {
    const ordered = direction === "down" ? [...freqs].reverse() : freqs;

    ordered.forEach((freq, index) => {
      const delay = index * (noteDuration + gapBetweenNotes);
      playFrequency(freq, delay, noteDuration);
    });
    return ordered.length * (noteDuration + gapBetweenNotes);
  }
}

// NOTE LOGIC
function getNoteNames(rootNote, content, direction) {
  const rootIndex = NOTE_INDEX[rootNote];

  if (isInterval(content)) {
    const semitones = INTERVALS[content];
    const secondIndex =
      direction === "up" ? rootIndex + semitones : rootIndex - semitones;

    return [rootNote, NOTES[(secondIndex + 12) % 12]];
  }

  if (isTriad(content)) {
    const notes = getTriadNoteNames(rootNote, content);
    return direction === "down" ? notes.reverse() : notes;
  }

  if (isScaleMode(content)) {
    const intervals = SCALE_MODES[content];
    return getScaleNoteNames(rootNote, intervals);
  }
}

// STATE
let current;
let selectedNotes = [];
let selectedRel = null;
let selectedAlt = null;
let selectedAltType = null;

let correct = 0;
let wrong = 0;

// UI
function nextQuestion() {
  document.getElementById("result").innerText = "";

  selectedNotes = [];
  selectedRel = null;
  selectedAlt = null;
  selectedAltType = null;

  // current = gammes[Math.floor(Math.random() * gammes.length)];

  // document.getElementById("question").innerText = current.ton;

  console.log("QUESTION CHOISIE :", current);
  document.getElementById("btn-nextQuestion").style.display = "none";
  document.getElementById("btn-validate").style.display = "grid";
  renderOptions();
}

function intervalsDisplay() {
  const intervalsDiv = document.getElementById("intervals");
  intervalsDiv.innerHTML = "";

  INTERVALS.forEach((note) => {
    const btn = document.createElement("button");
    btn.innerText = note;

    btn.onclick = () => {
      // ✅ on stocke la réponse
      selectedInterval = note;

      console.log("Interval sélectionné :", selectedInterval);

      // ✅ reset visuel (une seule sélection)
      [...intervalsDiv.querySelectorAll("button")].forEach((b) =>
        b.classList.remove("selected"),
      );

      btn.classList.add("selected");
    };

    intervalsDiv.appendChild(btn);
  });
}

function notesDisplay() {
  const notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  NOTES_GROUP.forEach((group) => {
    const row = document.createElement("div");
    row.classList.add("notes-grid");

    group.forEach((note) => {
      const btn = document.createElement("button");
      btn.innerText = note;

      btn.onclick = () => {
        // ✅ on stocke la réponse
        selectedNote = note;

        console.log("Note sélectionnée :", selectedNote);

        // ✅ reset visuel (une seule sélection)
        [...notesDiv.querySelectorAll("button")].forEach((b) =>
          b.classList.remove("selected"),
        );

        btn.classList.add("selected");
      };

      row.appendChild(btn);
    });

    notesDiv.appendChild(row);
  });
}

function renderOptions() {
  intervalsDisplay();
  notesDisplay();
}

function highlight(parent, selectedBtn) {
  [...parent.children].forEach((btn) => btn.classList.remove("selected"));
  selectedBtn.classList.add("selected");
}

// VALIDATION
function validate() {
  let ok = true;
  selectedNotes = [...new Set(selectedNotes)];

  // LOG des réponses utilisateur
  console.log("=== RÉPONSES UTILISATEUR ===");
  console.log("Relative :", selectedRel);
  console.log("Altérations (nombre) :", selectedAlt);
  console.log("Type altération :", selectedAltType);
  console.log("Notes :", selectedNotes);

  // LOG des bonnes réponses
  console.log("=== BONNES RÉPONSES ===");
  console.log("Relative :", current.rel);
  console.log("Altérations (nombre) :", current.alt);
  console.log("Type altération :", current.altType);
  console.log("Notes :", current.notes);

  // Vérifications
  if (selectedRel !== current.rel) ok = false;

  if (selectedAlt !== current.alt) ok = false;

  // type uniquement si alt > 0
  if (current.alt > 0) {
    if (selectedAltType !== current.altType) ok = false;
  }

  // comparaison des notes (triées)
  if (!sameNotes(selectedNotes, current.notes)) {
    ok = false;
  }

  // Résultat
  if (ok) {
    correct++;
    document.getElementById("result").innerText = "Correct !";
    document.getElementById("result").className = "correct";
    document.getElementById("btn-nextQuestion").style.display = "grid";
    document.getElementById("btn-validate").style.display = "none";
  } else {
    wrong++;
    document.getElementById("result").innerText = "Faux !";
    document.getElementById("result").className = "wrong";
  }

  document.getElementById("correct").innerText = correct;
  document.getElementById("wrong").innerText = wrong;
}

// START
nextQuestion();

// // UI INIT
// function nextQuestion() {
//   document.getElementById("result").innerText = "";

//   selectedNotes = [];
//   selectedRel = null;
//   selectedAlt = null;
//   selectedAltType = null;

//   // current = gammes[Math.floor(Math.random() * gammes.length)];

//   // document.getElementById("question").innerText = current.ton;

//   console.log("QUESTION CHOISIE :", current);
//   document.getElementById("btn-nextQuestion").style.display = "none";
//   document.getElementById("btn-validate").style.display = "grid";
//   renderOptions();
// }

//   // // type altération
//   // const altTypeDiv = document.getElementById("alterationType");
//   // altTypeDiv.innerHTML = "";

//   // ["♭", "#"].forEach((type) => {
//   //   const btn = document.createElement("button");
//   //   btn.innerText = type;

//   //   btn.onclick = () => {
//   //     selectedAltType = type;

//   //     // highlight
//   //     [...altTypeDiv.children].forEach((b) => b.classList.remove("selected"));
//   //     btn.classList.add("selected");
//   //   };

//   //   altTypeDiv.appendChild(btn);
//   // });

//   // // altérations
//   // const altDiv = document.getElementById("alterations");
//   // altDiv.innerHTML = "";
//   // for (let i = 0; i <= 6; i++) {
//   //   let btn = document.createElement("button");
//   //   btn.innerText = i;
//   //   btn.onclick = () => {
//   //     selectedAlt = i;
//   //     highlight(altDiv, btn);
//   //   };
//   //   altDiv.appendChild(btn);
//   // }

//   // // notes
//   // const notesDiv = document.getElementById("notes");
//   // notesDiv.innerHTML = "";

//   // notesGroups.forEach((group) => {
//   //   const row = document.createElement("div");
//   //   row.classList.add("notes-grid");

//   //   group.forEach((n) => {
//   //     let btn = document.createElement("button");
//   //     btn.innerText = n;

//   //     btn.onclick = () => {
//   //       if (selectedNotes.includes(n)) {
//   //         selectedNotes = selectedNotes.filter((x) => x !== n);
//   //         btn.classList.remove("selected");
//   //       } else {
//   //         selectedNotes.push(n);
//   //         btn.classList.add("selected");
//   //       }
//   //     };

//   //     row.appendChild(btn);
//   //   });

//   //   notesDiv.appendChild(row);
//   // });
// }

// function highlight(parent, selectedBtn) {
//   [...parent.children].forEach((btn) => btn.classList.remove("selected"));
//   selectedBtn.classList.add("selected");
// }

// // VALIDATION
// function validate() {
//   let ok = true;
//   selectedNotes = [...new Set(selectedNotes)];

//   // LOG des réponses utilisateur
//   console.log("=== RÉPONSES UTILISATEUR ===");
//   console.log("Relative :", selectedRel);
//   console.log("Altérations (nombre) :", selectedAlt);
//   console.log("Type altération :", selectedAltType);
//   console.log("Notes :", selectedNotes);

//   // LOG des bonnes réponses
//   console.log("=== BONNES RÉPONSES ===");
//   console.log("Relative :", current.rel);
//   console.log("Altérations (nombre) :", current.alt);
//   console.log("Type altération :", current.altType);
//   console.log("Notes :", current.notes);

//   // Vérifications
//   if (selectedRel !== current.rel) ok = false;

//   if (selectedAlt !== current.alt) ok = false;

//   // type uniquement si alt > 0
//   if (current.alt > 0) {
//     if (selectedAltType !== current.altType) ok = false;
//   }

//   // comparaison des notes (triées)
//   if (!sameNotes(selectedNotes, current.notes)) {
//     ok = false;
//   }

//   // Résultat
//   if (ok) {
//     correct++;
//     document.getElementById("result").innerText = "Correct !";
//     document.getElementById("result").className = "correct";
//     document.getElementById("btn-nextQuestion").style.display = "grid";
//     document.getElementById("btn-validate").style.display = "none";
//   } else {
//     wrong++;
//     document.getElementById("result").innerText = "Faux !";
//     document.getElementById("result").className = "wrong";
//   }

//   document.getElementById("correct").innerText = correct;
//   document.getElementById("wrong").innerText = wrong;
// }

// function sameNotes(a, b) {
//   if (a.length !== b.length) return false;

//   const sortedA = [...a].sort();
//   const sortedB = [...b].sort();

//   return sortedA.every((note, i) => note === sortedB[i]);
// }

// nextQuestion();

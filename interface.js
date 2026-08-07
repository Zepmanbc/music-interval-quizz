import { INTERVALS_OPTIONS, setupIntervalQuizz } from "./interval.js";
import { playNotes, playChord } from "./piano.js";

const exerciseType = document.querySelector("#exercise-type");
const exerciseOptions = document.getElementById("exercise-options");
const playMusicBtn = document.getElementById("play-music-btn");
const startingNoteText = document.getElementById("starting-note");
const validateBtn = document.getElementById("validate");
const nextQuestionBtn = document.getElementById("nextQuestion");
const responseArea = document.getElementById("response-area");
const displayZone = document.getElementById("display-zone");
const correctScoreDisplay = document.getElementById("correct");
const wrongScoreDisplay = document.getElementById("wrong");
let cachedNotesToPlayFunction;
let exerciceCheckResponse;
let correctScore = 0;
let wrongScore = 0;

const CHORDS_OPTIONS = ["3 sons", "4 sons"];
const MODES_OPTIONS = ["Ascendant", "Descendant"];

// Buttons Behavior
function btnGroupSetupSwitch(group, onClick = null) {
  const buttons = group.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (onClick) {
        onClick(btn);
      }
    });
  });
}

function btnGroupSetupSwitchUnselect(group, onClick = null) {
  const buttons = group.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Si le bouton est déjà actif, on le désactive
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        if (onClick) {
          onClick(btn);
        }
      } else {
        // Sinon on désactive les autres et on active celui-ci
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (onClick) {
          onClick(btn);
        }
      }
    });
  });
}

function btnGroupSetupToggle(group) {
  const buttons = group.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });
}

function btnGroupSetupToggleAlwaysOne(group) {
  const buttons = group.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Si le bouton est actif, on vérifie qu'il y en a d'autres
      if (btn.classList.contains("active")) {
        const activeButtons = group.querySelectorAll("button.active");

        // On ne désactive que s'il reste au moins un autre bouton actif
        if (activeButtons.length > 1) {
          btn.classList.remove("active");
        }
      } else {
        btn.classList.add("active");
      }
    });
  });
}

function setupButtonsBehevior() {
  const switchBtns = document.querySelectorAll(".switch-btns");
  const switchUnselectBtns = document.querySelectorAll(".switch-unselect-btns");
  const toggleBtns = document.querySelectorAll(".toggle-btns");
  const toggleBtnsAlwaysOne = document.querySelectorAll(
    ".toggle-btns-always-one",
  );
  switchBtns.forEach((group) => {
    btnGroupSetupSwitch(group);
  });
  switchUnselectBtns.forEach((group) => {
    btnGroupSetupSwitchUnselect(group);
  });
  toggleBtns.forEach((group) => {
    btnGroupSetupToggle(group);
  });
  toggleBtnsAlwaysOne.forEach((group) => {
    btnGroupSetupToggleAlwaysOne(group);
  });
}

// Logic
export function initialSetup() {
  // Exercise Type Buttons
  btnGroupSetupSwitch(exerciseType, (btn) => {
    responseArea.textContent = "";
    renderOptions(btn.dataset.type);
  });

  nextQuestionBtn.addEventListener("click", runExercise);
  validateBtn.addEventListener("click", () => {
    exerciceCheckResponse();
  });
  renderOptions("interval");
}

function getExerciseConfig() {
  const exerciseType = document.querySelector(".type-btn.active").dataset.type;
  const exerciseOptions = [
    ...document.querySelectorAll(".option-btn.active"),
  ].map((element) => element.dataset.value);
  console.log(
    `exerciseType: ${exerciseType} - exerciseOptions: ${exerciseOptions.join(", ")}`,
  );
  return { exerciseType, exerciseOptions };
}

export function renderOptions(type) {
  setupOptionsBtns(type);
  runExercise();
}

function setupOptionsBtns(type) {
  exerciseOptions.innerHTML = "";

  let optionsList = [];
  if (type === "interval") optionsList = INTERVALS_OPTIONS;
  if (type === "chords") optionsList = CHORDS_OPTIONS;
  if (type === "mode") optionsList = MODES_OPTIONS;

  optionsList.forEach((item) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.dataset.value = item;
    btn.textContent = item;
    exerciseOptions.appendChild(btn);
  });

  // default active first
  exerciseOptions.querySelector("button")?.classList.add("active");
}

function runExercise() {
  reset();
  const config = getExerciseConfig();
  if (config.exerciseType == "interval") {
    displayZone.classList.remove("hidden");
    let exercice = setupIntervalQuizz(config["exerciseOptions"]);
    cachedNotesToPlayFunction = () => {
      playNotes(exercice.notesToPlay);
    };
    playMusicBtn.addEventListener("click", cachedNotesToPlayFunction);
    startingNoteText.textContent = exercice.startingNote;
    responseArea.appendChild(exercice.interface());
    exerciceCheckResponse = exercice.checkResponse;
    // validateBtn.addEventListener("click", exercice.checkResponse);

    setupButtonsBehevior();
  }
}

function reset() {
  validateBtn.classList.remove("hidden");
  displayZone.classList.add("hidden");
  playMusicBtn.removeEventListener("click", cachedNotesToPlayFunction);
  responseArea.textContent = "";
}

export function checkAnimation(result) {
  showFeedback(result);
  if (result) {
    validateBtn.classList.add("hidden");
    correctScore++;
  } else {
    wrongScore++;
  }
  correctScoreDisplay.textContent = correctScore;
  wrongScoreDisplay.textContent = wrongScore;
}

function showFeedback(success) {
  const feedback = document.createElement("div");

  feedback.className = "result-feedback";
  feedback.textContent = success ? "✅" : "❌";

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 1000);
}

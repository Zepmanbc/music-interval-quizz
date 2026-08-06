import { playNotes, playChord } from "./piano.js";
import { INTERVALS, setupIntervalQuizz } from "./interval.js";

const INTERVALS_OPTIONS = ["Ascendant", "Descendant"];
const CHORDS_OPTIONS = ["3 sons", "4 sons"];
const MODES_OPTIONS = ["Ascendant", "Descandant"];

// Logic
function getExerciseConfig() {
  const exerciseType = document.querySelector(".type-btn.active").dataset.type;
  const exerciseOptions = [
    ...document.querySelectorAll(".option-btn.active"),
  ].map((element) => element.dataset.value);
  console.log("exerciseType : " + exerciseType);
  console.log("exerciseOptions : " + exerciseOptions.join(", "));
  return { exerciseType, exerciseOptions };
}
function runExercise() {
  reset();
  const config = getExerciseConfig();
  console.log(config);
  let exercice = setupIntervalQuizz(config["exerciseOptions"]);
  cachedNotesToPlayFunction = () => {
    playNotes(exercice.notesToPlay);
  };
  startStopBtn.addEventListener("click", cachedNotesToPlayFunction);
}

// Interface
const INTERVALS_KEYS = Object.keys(INTERVALS);
const exerciseOptions = document.getElementById("exercise-options");
const startStopBtn = document.getElementById("start-stop");
const startinNote = document.getElementById("starting-note");
const validateBtn = document.getElementById("validate");
const nextQuestionBtn = document.getElementById("nextQuestion");
let cachedNotesToPlayFunction;

validateBtn.addEventListener("click", runExercise);

let isPlaying = false;

function renderOptions(type) {
  exerciseOptions.innerHTML = "";

  let list = [];
  if (type === "interval") list = INTERVALS_OPTIONS;
  if (type === "chords") list = CHORDS_OPTIONS;
  if (type === "mode") list = MODES_OPTIONS;

  list.forEach((item) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.dataset.value = item;
    btn.textContent = item;
    exerciseOptions.appendChild(btn);

    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });

  // default active first
  exerciseOptions.querySelector("button")?.classList.add("active");
}

function setupSwitch(groupId) {
  const group = document.getElementById(groupId);
  const buttons = group.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function setupToggle(groupId) {
  const group = document.getElementById(groupId);
  const buttons = group.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

document.querySelectorAll(".type-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".type-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderOptions(btn.dataset.type);
  });
});

// initializaton
function reset() {
  startStopBtn.removeEventListener("click", cachedNotesToPlayFunction);
}

setupSwitch("exercise-type");
renderOptions("interval");

runExercise();

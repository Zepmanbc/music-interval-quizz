import { INTERVALS, setupIntervalQuizz } from "./interval.js";
import { playNotes, playChord } from "./piano.js";

const exerciseType = document.querySelector("#exercise-type");

const INTERVALS_KEYS = Object.keys(INTERVALS);

const exerciseOptions = document.getElementById("exercise-options");
const startStopBtn = document.getElementById("start-stop");
const startingNoteText = document.getElementById("starting-note");
const validateBtn = document.getElementById("validate");
const nextQuestionBtn = document.getElementById("nextQuestion");
const responseArea = document.getElementById("response-area");
const displayZone = document.getElementById("display-zone");
let cachedNotesToPlayFunction;

const INTERVALS_OPTIONS = ["Ascendant", "Descendant"];
const CHORDS_OPTIONS = ["3 sons", "4 sons"];
const MODES_OPTIONS = ["Ascendant", "Descandant"];

export function btnGroupSetupSwitch(group, onClick) {
  const buttons = group.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onClick(btn);
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

export function setupButtonsBehevior() {
  const switchBtns = document.querySelectorAll(".switch-btns");
  const toggleBtns = document.querySelectorAll(".toggle-btns");
  switchBtns.forEach((group) => {
    btnGroupSetupSwitch(group);
  });
  toggleBtns.forEach((group) => {
    btnGroupSetupToggle(group);
  });
}

export function initialSetup() {
  // Exercise Type Buttons
  btnGroupSetupSwitch(exerciseType, (btn) => {
    responseArea.textContent = "";
    renderOptions(btn.dataset.type);
  });

  nextQuestionBtn.addEventListener("click", runExercise);
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
  exerciseOptions.innerHTML = "";

  let list = [];
  if (type === "interval") list = INTERVALS_OPTIONS;
  if (type === "chords") list = CHORDS_OPTIONS;
  if (type === "mode") list = MODES_OPTIONS;

  list.forEach((item) => {
    const btn = document.createElement("button");
    // btn.classList.add("option-btn");
    // btn.classList.add("switch-btns");
    btn.dataset.value = item;
    btn.textContent = item;
    exerciseOptions.appendChild(btn);

    // btn.addEventListener("click", () => {
    //   btn.classList.toggle("active");
    // });
  });

  // default active first
  exerciseOptions.querySelector("button")?.classList.add("active");

  setupButtonsBehevior();
  runExercise();
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
    startStopBtn.addEventListener("click", cachedNotesToPlayFunction);
    startingNoteText.textContent = exercice.startingNote;
    responseArea.appendChild(exercice.interface());
  }
}

function reset() {
  displayZone.classList.add("hidden");
  startStopBtn.removeEventListener("click", cachedNotesToPlayFunction);
  responseArea.textContent = "";
}

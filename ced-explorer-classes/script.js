/**
 * script.js
 * Controller for CED Explorer Classes with Morphological Template Header & Dual Mode Practice.
 */

import { dict } from "./dict_verbs.js";
import { formatTone, normalize, boldAsterisk } from "./orthography.js";
import { formatTemplate } from "./template_formatter.js";

// Form Name Labels
const formNames = {
  third_present: "Third person present",
  first_present: "First person present",
  third_completive_past: "Third person completive past",
  third_incompletive_habitual: "Third person habitual",
  second_command: "Second person imperative",
  third_infinitive: "Third person infinitive",
};

// DOM References
const modeChoiceBtn = document.querySelector("#mode-choice-btn");
const modeWriteinBtn = document.querySelector("#mode-writein-btn");
const choiceModeContainer = document.querySelector("#choice-mode-container");
const writeInModeContainer = document.querySelector("#write-in-mode-container");

const settingsForm = document.querySelector(".settings");
const targetFormSelect = document.querySelector("#targetForm");
const requireAudioCheckbox = document.querySelector("#requireAudio");

const templateHeaderElm = document.querySelector("#template-header");
const audioWrapper = document.querySelector("#audio-wrapper");
const sentenceSyllabary = document.querySelector(".example-syllabary");
const sentencePhonetics = document.querySelector(".example-phonetics");
const sentenceEnglish = document.querySelector(".example-english");
const optionsElm = document.querySelector(".options");

const targetFormNameElm = document.querySelector("#target-form-name");
const answerForm = document.querySelector(".answer-form");
const answerInput = document.querySelector("#answer-input");
const checkBtn = document.querySelector("#check-btn");
const revealBtn = document.querySelector("#reveal-btn");
const nextCardBtn = document.querySelector("#next-card-btn");
const feedbackWrapper = document.querySelector("#feedback-wrapper");
const feedbackMessage = document.querySelector("#feedback-message");
const answerDetails = document.querySelector("#answer-details");

// Application State
let activeMode = "choice"; // 'choice' | 'writein'
let targetForm = targetFormSelect.value;
let requireAudio = requireAudioCheckbox.checked;
let wordIds = null;
let currentWord = null;
let currentForm = null;
let currentOptions = [];
let isAnsweredOrRevealed = false;
let lastTransitionTime = 0;

const possibleForms = [...targetFormSelect.children]
  .map((e) => e.value)
  .filter((f) => f !== "rand");

// Helpers
function hasFields(word) {
  return (
    word &&
    word.sentence &&
    word.sentence.phonetics &&
    word.sentence.syllabary &&
    word.sentence.phonetics.length > 0 &&
    word.sentence.syllabary.length > 0 &&
    word.sentence.phonetics.includes("*") &&
    word.sentence.syllabary.includes("*") &&
    !word.sentence.phonetics.startsWith("[") &&
    (!requireAudio || Boolean(word.sentence.audio))
  );
}

function validWordsForForm(form) {
  return Object.keys(dict).filter((id) => {
    const word = dict[id];
    return (
      hasFields(word) &&
      word[form] &&
      word[form].trim().replaceAll("-", "").length > 0
    );
  });
}

function pickRandom(list) {
  if (!list || list.length === 0) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

function pickNRandom(list, n) {
  if (!list || list.length === 0) return [];
  const pool = [...list];
  const count = Math.min(n, pool.length);
  const picked = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(r, 1)[0]);
  }
  return picked;
}

function shuffled(list) {
  if (!list || list.length === 0) return [];
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function cedLinkForWord(word) {
  try {
    const resp = await fetch(
      `https://cherokeedictionary.net/jsonsearch/en/${encodeURIComponent(
        word.definition
      )}`
    );
    const json = await resp.json();
    const result = json.find(
      (r) => r.syllabaryb === word.third_present_syllabary
    );
    if (result && result.id) {
      return `https://www.cherokeedictionary.net/share/${result.id}`;
    }
  } catch (err) {
    console.error("Failed to load CED link:", err);
  }
  return `https://www.cherokeedictionary.net/`;
}

// Mode Management
function setMode(mode) {
  activeMode = mode;
  if (mode === "choice") {
    modeChoiceBtn.classList.add("active");
    modeChoiceBtn.setAttribute("aria-selected", "true");
    modeWriteinBtn.classList.remove("active");
    modeWriteinBtn.setAttribute("aria-selected", "false");
    choiceModeContainer.hidden = false;
    writeInModeContainer.hidden = true;
  } else {
    modeWriteinBtn.classList.add("active");
    modeWriteinBtn.setAttribute("aria-selected", "true");
    modeChoiceBtn.classList.remove("active");
    modeChoiceBtn.setAttribute("aria-selected", "false");
    choiceModeContainer.hidden = true;
    writeInModeContainer.hidden = false;
    answerInput.focus();
  }
}

// Card Rendering
function setTemplateHeader(word) {
  if (!templateHeaderElm) return;
  if (word.template_html) {
    templateHeaderElm.innerHTML = word.template_html;
  } else {
    const tpl = formatTemplate(word);
    templateHeaderElm.innerHTML = tpl.html;
  }
}

function setExampleSentence(word) {
  if (word.sentence.audio) {
    const audioElm = document.createElement("audio");
    audioElm.src = word.sentence.audio;
    audioElm.controls = true;
    audioElm.autoplay = true;
    audioElm.style.display = "inline-block";
    audioWrapper.replaceChildren(audioElm);
  } else {
    audioWrapper.innerHTML = "";
  }
  sentenceSyllabary.innerHTML = boldAsterisk(word.sentence.syllabary);
  sentencePhonetics.innerHTML = boldAsterisk(word.sentence.phonetics);
  sentenceEnglish.innerHTML = "";
}

function playCurrentSentenceAudio() {
  const audioElm = audioWrapper.querySelector("audio");
  if (audioElm) {
    audioElm.currentTime = 0;
    audioElm.play().catch(() => {});
  } else if (currentWord?.sentence?.audio) {
    const audio = new Audio(currentWord.sentence.audio);
    audio.play().catch(() => {});
  }
}

function renderChoiceOptions(options, form) {
  const renderedOptions = options.map((option, idx) => {
    let clicked = false;
    const elm = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-option-btn";

    const isCorrect = idx === 0;
    const syllabary = option[form + "_syllabary"] || "";
    const toneStr = formatTone(option[form]);
    button.innerHTML = `<strong>${syllabary}</strong> / <span>${toneStr}</span>`;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastTransitionTime < 250) {
        return;
      }

      if (clicked) {
        if (isCorrect) {
          lastTransitionTime = Date.now();
          nextWord();
        }
        return;
      }
      clicked = true;

      const wordTranslation = document.createElement("span");
      wordTranslation.className = "translation";
      wordTranslation.innerHTML = ` ${option.definition} &mdash; `;

      const cedLink = document.createElement("a");
      cedLink.innerHTML = "see more on CED";
      cedLink.target = "_blank";
      cedLink.rel = "noopener noreferrer";
      cedLinkForWord(option).then((link) => {
        cedLink.href = link;
      });
      wordTranslation.appendChild(cedLink);
      elm.appendChild(wordTranslation);

      if (isCorrect) {
        button.classList.add("btn-correct");
        button.title = "Click again to go to the next word";
        sentenceEnglish.innerHTML = boldAsterisk(currentWord.sentence.english);
        playCurrentSentenceAudio();
      } else {
        button.classList.add("btn-incorrect");
      }
    });

    elm.appendChild(button);
    return elm;
  });

  optionsElm.replaceChildren(...shuffled(renderedOptions));
}

function revealWriteInDetails() {
  sentenceEnglish.innerHTML = boldAsterisk(currentWord.sentence.english);

  const formattedTone = formatTone(currentWord[currentForm]);
  const syllabary = currentWord[currentForm + "_syllabary"] || "";
  const simpleRoman = currentWord[currentForm + "_simple"] || "";

  answerDetails.innerHTML = "";

  const mainWordElm = document.createElement("div");
  mainWordElm.className = "target-answer-word";
  mainWordElm.innerHTML = `<strong>${syllabary}</strong> &mdash; <span>${formattedTone}</span> <span class="simple-hint">(${simpleRoman})</span>`;
  answerDetails.appendChild(mainWordElm);

  const defElm = document.createElement("div");
  defElm.className = "target-definition";
  defElm.innerHTML = `<em>Definition:</em> ${currentWord.definition} &mdash; `;

  const cedLink = document.createElement("a");
  cedLink.innerHTML = "see more on CED";
  cedLink.target = "_blank";
  cedLink.rel = "noopener noreferrer";
  cedLinkForWord(currentWord).then((link) => {
    cedLink.href = link;
  });
  defElm.appendChild(cedLink);
  answerDetails.appendChild(defElm);

  feedbackWrapper.hidden = false;
}

// Next Word Transition
function nextWord() {
  lastTransitionTime = Date.now();
  currentForm =
    targetForm === "rand" ? pickRandom(possibleForms) : targetForm;

  if (wordIds === null || targetForm === "rand") {
    wordIds = validWordsForForm(currentForm);
  }

  if (!wordIds || wordIds.length === 0) {
    sentenceSyllabary.textContent = "No sentences found matching criteria.";
    sentencePhonetics.textContent = "";
    sentenceEnglish.textContent = "";
    audioWrapper.innerHTML = "";
    templateHeaderElm.innerHTML = "";
    targetFormNameElm.textContent = formNames[currentForm] || currentForm;
    optionsElm.innerHTML = "";
    return;
  }

  const chosenOptionIds = pickNRandom(wordIds, 4);
  currentOptions = chosenOptionIds.map((id) => dict[id]);
  currentWord = currentOptions[0];
  isAnsweredOrRevealed = false;

  targetFormNameElm.textContent = formNames[currentForm] || currentForm;

  // Set Template Header & Sentence
  setTemplateHeader(currentWord);
  setExampleSentence(currentWord);

  // Set Multiple Choice Options
  renderChoiceOptions(currentOptions, currentForm);

  // Reset Write-In State
  answerInput.value = "";
  answerInput.classList.remove("input-correct", "input-incorrect");
  feedbackWrapper.hidden = true;
  feedbackMessage.className = "feedback-message";
  feedbackMessage.textContent = "";
  answerDetails.innerHTML = "";
  checkBtn.textContent = "Check";

  if (activeMode === "writein") {
    answerInput.focus();
  }
}

// Write-In Actions
function handleCheck() {
  const userInput = answerInput.value.trim();
  if (!userInput) {
    answerInput.focus();
    return;
  }

  const normInput = normalize(userInput);
  const baseCandidates = [
    normalize(currentWord[currentForm + "_simple"]),
    normalize(currentWord[currentForm]),
    normalize(currentWord[currentForm + "_syllabary"]),
  ].filter(Boolean);

  const candidateMatches = new Set(baseCandidates);

  if (
    currentForm === "third_completive_past" ||
    currentForm === "third_incompletive_habitual"
  ) {
    for (const cand of baseCandidates) {
      if (cand.endsWith("i") || cand.endsWith("Ꭲ") || cand.endsWith("\uab72")) {
        candidateMatches.add(cand.slice(0, -1));
      }
    }
  }

  const isCorrect = candidateMatches.has(normInput);

  if (isCorrect) {
    isAnsweredOrRevealed = true;
    answerInput.classList.remove("input-incorrect");
    answerInput.classList.add("input-correct");
    feedbackMessage.className = "feedback-message correct";
    feedbackMessage.textContent = "✓ Correct!";
    checkBtn.textContent = "Next →";
    revealWriteInDetails();
    playCurrentSentenceAudio();
  } else {
    answerInput.classList.remove("input-correct");
    answerInput.classList.add("input-incorrect");
    feedbackMessage.className = "feedback-message incorrect";
    feedbackMessage.textContent = "✗ Not quite. Try again, or click 'Reveal Answer'.";
    feedbackWrapper.hidden = false;
    answerInput.focus();
    answerInput.select();
  }
}

function handleReveal() {
  if (!currentWord) return;
  isAnsweredOrRevealed = true;
  answerInput.classList.remove("input-incorrect");
  feedbackMessage.className = "feedback-message revealed";
  feedbackMessage.textContent = "Answer:";
  checkBtn.textContent = "Next →";
  revealWriteInDetails();
}

// Event Listeners
modeChoiceBtn.addEventListener("click", () => setMode("choice"));
modeWriteinBtn.addEventListener("click", () => setMode("writein"));

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  nextWord();
});

targetFormSelect.addEventListener("change", (e) => {
  targetForm = e.target.value;
  wordIds = null;
  nextWord();
});

requireAudioCheckbox.addEventListener("change", (e) => {
  requireAudio = e.target.checked;
  wordIds = null;
  nextWord();
});

answerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isAnsweredOrRevealed) {
    nextWord();
  } else {
    handleCheck();
  }
});

revealBtn.addEventListener("click", handleReveal);
nextCardBtn.addEventListener("click", nextWord);

// Initial Load
setMode("choice");
nextWord();

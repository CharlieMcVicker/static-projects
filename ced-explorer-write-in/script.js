import { dict } from "./dict_verbs.js";

const formNames = {
  third_present: "Third person present",
  first_present: "First person present",
  third_completive_past: "Third person completive past",
  third_incompletive_habitual: "Third person habitual",
  second_command: "Second person imperative",
  third_infinitive: "Third person infinitive",
};

const underdot = "\u0323"; // dot for under short vowels

function formatTone(text) {
  if (!text) return "";
  return text
    .replaceAll(/1/gm, "¹")
    .replaceAll(/23/gm, "²³")
    .replaceAll(/32/gm, "³²")
    .replaceAll(/2/gm, "²")
    .replaceAll(/3/gm, "³")
    .replaceAll(/4/gm, "⁴")
    .replaceAll(/\?/gm, "Ɂ")
    .replaceAll(/([aeiouv])\./gm, "$1" + underdot);
}

function subAsterisk(text, pattern) {
  if (!text) return "";
  const bold = /\*(.*?)\*/gm;
  return text.replace(bold, pattern);
}

function boldAsterisk(text) {
  return subAsterisk(text, "<strong>$1</strong>");
}

function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, "") // strip diacritics & combining marks
    .replace(/[0-9¹²³⁴⁰⁵⁶⁷⁸⁹]/g, "") // strip tone numbers & superscripts
    .replace(/[\x27\x60\u00B4\u02BB\u02BC\u02BD\u02C0\u02C1\u02C6\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u0241\u0242\u0294\?\.\,\-\_\/\!\:\;\s\(\)\[\]\{\}\~\#\@\*\+\=\<\>\|]/g, "") // strip ticks, quotes, glottals, punctuation, spaces
    .replaceAll("ts", "j") // normalize spelling ts -> j
    .trim();
}

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

function pickRandom(options) {
  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
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

// DOM Elements
const settingsForm = document.querySelector(".settings");
const targetFormSelect = document.querySelector("#targetForm");
const requireAudioCheckbox = document.querySelector("#requireAudio");

const audioWrapper = document.querySelector("#audio-wrapper");
const sentenceSyllabary = document.querySelector(".example-syllabary");
const sentencePhonetics = document.querySelector(".example-phonetics");
const sentenceEnglish = document.querySelector(".example-english");

const targetFormNameElm = document.querySelector("#target-form-name");
const answerForm = document.querySelector(".answer-form");
const answerInput = document.querySelector("#answer-input");
const checkBtn = document.querySelector("#check-btn");
const revealBtn = document.querySelector("#reveal-btn");
const nextCardBtn = document.querySelector("#next-card-btn");

const feedbackWrapper = document.querySelector("#feedback-wrapper");
const feedbackMessage = document.querySelector("#feedback-message");
const answerDetails = document.querySelector("#answer-details");

// State
let targetForm = targetFormSelect.value;
let requireAudio = requireAudioCheckbox.checked;
let wordIds = null;
let currentWord = null;
let currentForm = null;
let isAnsweredOrRevealed = false;

const possibleForms = [...targetFormSelect.children]
  .map((e) => e.value)
  .filter((f) => f !== "rand");

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

function revealAnswerDetails(isCorrect) {
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

function nextWord() {
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
    targetFormNameElm.textContent = formNames[currentForm] || currentForm;
    return;
  }

  const pickedId = pickRandom(wordIds);
  currentWord = dict[pickedId];
  isAnsweredOrRevealed = false;

  targetFormNameElm.textContent = formNames[currentForm] || currentForm;
  setExampleSentence(currentWord);

  // Reset input & feedback
  answerInput.value = "";
  answerInput.classList.remove("input-correct", "input-incorrect");
  feedbackWrapper.hidden = true;
  feedbackMessage.className = "feedback-message";
  feedbackMessage.textContent = "";
  answerDetails.innerHTML = "";
  checkBtn.textContent = "Check";

  answerInput.focus();
}

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
    revealAnswerDetails(true);
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
  revealAnswerDetails(false);
}

// Event Listeners
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

revealBtn.addEventListener("click", () => {
  handleReveal();
});

nextCardBtn.addEventListener("click", () => {
  nextWord();
});

// Initial startup
nextWord();

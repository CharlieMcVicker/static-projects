/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

const makeImagePath = (person) => `/pronoun-game/pronoun-icons/${person}@2x.png`

function selectRandomOption(selectElm) {
  let idx = Math.floor(Math.random() * (selectElm.childElementCount - 1));
  if (idx >= selectElm.selectedIndex) {
    idx += 1;
  }
  selectElm.value = selectElm.children[idx].value;
}

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the steps in the TODO 🚧
*/
const pronouns = {
  "1sg": { A: ["tsi²", "g"], B: ["a²¹gi²", "a²¹gw"] },
  "1dl-ex": { A: ["o²¹sdi²²", "o²¹sd"], B: ["o²¹gi²ni²²", "o²¹gi²n"] },
  "1pl-ex": { A: ["o²¹tsi²²", "o²¹ts"], B: ["o²¹gi²²", "o²¹g"] },
  "1dl-in": { A: ["i²¹ni²²", "i²¹n"], B: ["gi²ni²²", "gi²n"] },
  "1pl-in": { A: ["i²¹di²²", "i²¹d"], B: ["i²¹gi²²", "i²¹g"] },
  "2sg": { A: ["hi²", "h"], B: ["tsa²", "ts"] },
  "2dl": { A: ["sdi²²", "sd"], B: ["sdi²²", "sd"] },
  "2pl": { A: ["i²¹tsi²²", "i²¹ts"], B: ["i²¹tsi²²", "i²¹ts"] },
  "3sg": { A: ["a²¹", "g"], B: ["u²¹", "u²¹w"] },
  "3ns": { A: ["a²¹ni²²", "a²¹n"], B: ["u²¹ni²²", "u²¹n"] },
};

const form = document.querySelector("#theform");
const answer = document.querySelector("#answer");
const answerExplanation = document.querySelector("#answerExplanation");
const answerLabel = document.querySelector("#answerLabel");
const diagram = document.querySelector("#diagram");
const definition = document.querySelector("#definition");
const randomButton = document.querySelector("#random");
const submitButton = document.querySelector("#submitButton");
const dropdowns = document.querySelector("#pronoun-and-verb");
const randomVerbButton = document.querySelector("#random-verb");
const randomPronounButton = document.querySelector("#random-pronoun");

let lastButtonHit = randomButton;

if (randomPronounButton) {
  randomPronounButton.onclick = () => {
    lastButtonHit = randomPronounButton;
    randomizePronoun();
  };
}

if (randomVerbButton) {
  randomVerbButton.onclick = () => {
    lastButtonHit = randomVerbButton;
    randomizeVerb();
  };
}

function generatePrompt() {
  // const pronoun = form.pronoun.children[form.pronoun.selectedIndex];
  // const pronounText = pronoun.innerHTML.split("...")[0];
  // const verb = form.verb.children[form.verb.selectedIndex];
  // const verbText = verb.innerHTML.match(/\((.*)\)/)[1];
  // return `${pronounText} ${verbText}`;
  return form.verb.children[form.verb.selectedIndex].innerHTML;
}

function updateAnswerLabel() {
  answerLabel.innerHTML = generatePrompt();
  diagram.src = makeImagePath(form.pronoun.value);
}

function randomizeVerb() {
  selectRandomOption(form.verb);
  updateAnswerLabel();
  updateUXAfterChange();
}

function randomizePronoun() {
  selectRandomOption(form.pronoun);
  updateUXAfterChange();
}

function randomize() {
  selectRandomOption(form.pronoun);
  selectRandomOption(form.verb);
  updateUXAfterChange();
}

function updateUXAfterChange() {
  answer.innerHTML = "&nbsp;";
  answerExplanation.innerHTML = "&nbsp;";
  submitButton.value = "Show";
  updateAnswerLabel();
  document
    .querySelectorAll("button")
    .forEach((e) => e.classList.remove("current-random"));
  lastButtonHit.classList.add("current-random");
}

function figureOutAnswer() {
  // The 'dipped' class in style.css changes the appearance on click
  const pronoun = form.pronoun.value;
  let [verb, pronounSet, ...rest] = form.verb.value.split(",");
  const verbStartsWithVowel = ["a", "e", "i", "o", "u", "v"].includes(
    verb.charAt(0)
  );
  if (pronoun === "3sg" && rest.includes("ga")) {
    const prefix = "ga²";
    return [prefix, pronounSet, `*${prefix}*${verb}`];
  }
  if (verbStartsWithVowel && pronoun === "3sg") {
    if (verb.charAt(0) === "a") {
      const prefix = pronouns[pronoun][pronounSet][0];
      return [prefix, pronounSet, `*${prefix}*${verb.replace(/^a[¹²³⁴]*/, "")}`];
    } else if (verb.charAt(0) === "e") {
      return ["(nothing)", pronounSet, verb];
    } else {
      const prefix = "g";
      return [prefix, pronounSet, `*${prefix}*${verb}`];
    }
  }

  if (pronoun === "1sg" && rest.includes("h")) {
    const hIdx = verb.indexOf("h");
    if (hIdx !== -1) {
      const replace = ["a", "e", "i", "o", "u", "v"].includes(
        verb.charAt(hIdx + 1)
      )
        ? "Ɂ"
        : "";
      verb = verb.substring(0, hIdx) + replace + verb.substring(hIdx + 1);
    }
  }

  const prefix = pronouns[pronoun][pronounSet][verbStartsWithVowel + 0];
  return [prefix, pronounSet, `*${prefix}*${verb}`];
}

function formatAnswer(answer, pronounSet) {
  return answer.replace(/\*(.*)\*/, `<span class="set-${pronounSet.toLowerCase()}">$1</span>`);
}

if (randomButton) {
  randomButton.onclick = function (e) {
    lastButtonHit = randomButton;
    randomize();
  };
  randomize();
}

if (form) {
  const showOptChange = () => {
    if (form.showOptions.checked) {
      dropdowns.classList.remove("hidden");
    } else {
      dropdowns.classList.add("hidden");
    }
  };
  form.showOptions.onchange = showOptChange;
  showOptChange();

  [form.verb, form.pronoun].forEach(
    (e) =>
      (e.onchange = () => {
        updateUXAfterChange();
      })
  );

  // Detect clicks on the button
  form.onsubmit = function (e) {
    e.preventDefault();
    const [prefix, pronounSet, answerText] = figureOutAnswer();
    const pronoun = form.pronoun.children[form.pronoun.selectedIndex];
    const pronounText = pronoun.innerHTML.split("...")[0];
    const newAnswerExplanation = `<strong>${prefix}-</strong> <em>${pronounText}</em> (Set ${pronounSet})`;
    if (answerExplanation.innerHTML === newAnswerExplanation) {
      lastButtonHit.click();
      return;
    } else {
      answer.innerHTML = formatAnswer(answerText, pronounSet);
      answerExplanation.innerHTML = newAnswerExplanation;
      submitButton.value = "Clear";
    }
  };
}

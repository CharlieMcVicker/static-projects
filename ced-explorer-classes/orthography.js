/**
 * orthography.js
 * Cherokee orthography, tone formatting, consonant unrespelling, and text normalization.
 */

const underdot = "\u0323"; // combining dot below

export function formatTone(text) {
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

export function subAsterisk(text, pattern) {
  if (!text) return "";
  const bold = /\*(.*?)\*/gm;
  return text.replace(bold, pattern);
}

export function boldAsterisk(text) {
  return subAsterisk(text, "<strong>$1</strong>");
}

export function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, "") // strip diacritics & combining marks
    .replace(/[0-9¹²³⁴⁰⁵⁶⁷⁸⁹]/g, "") // strip tone numbers & superscripts
    .replace(
      /[\x27\x60\u00B4\u02BB\u02BC\u02BD\u02C0\u02C1\u02C6\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u0241\u0242\u0294\?\.\,\-\_\/\!\:\;\s\(\)\[\]\{\}\~\#\@\*\+\=\<\>\|]/g,
      ""
    ) // strip ticks, quotes, glottals, punctuation, spaces
    .replaceAll("ts", "j") // normalize spelling ts -> j
    .trim();
}

export function unrespellConsonants(s) {
  if (!s) return "";
  let res = s.toLowerCase();
  res = res.replace(/(^|[aeiouv])hs/g, "$1s");

  const rules = [
    ["tsh", "ch"],
    ["ts", "j"],
    ["k", "g"],
    ["gh", "k"],
    ["t", "d"],
    ["dh", "t"],
    ["nh", "hn"],
    ["lh", "hl"],
    ["yh", "hy"],
    ["wh", "hw"],
    ["slh", "sl"],
  ];
  for (const [oldVal, newVal] of rules) {
    res = res.replaceAll(oldVal, newVal);
  }
  return res;
}

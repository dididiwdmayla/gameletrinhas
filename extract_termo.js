const fs = require("fs");

const data = fs.readFileSync("termo_multi.js", "utf8");

// Extract ANSWERS
const pfMatch = data.match(/Pf=\[(.*?)\]/);
const answersRaw = pfMatch ? pfMatch[1] : "";

// Extract VALID GUESSES
const rfMatch = data.match(/Rf=new Set\(\[(.*?)\]\)/);
const validRaw = rfMatch ? rfMatch[1] : "";

// We also need to add ANSWERS to the valid guesses, as the prompt did, or just use what we extracted.
// Wait, in Termo, Rf might already include Pf, or maybe they are checked together. Let's just do exactly what the user said.

const wordsFileContent = `// PENTÁGONO — Lista de RESPOSTAS oficiais.
export const ANSWERS: string[] = [
  ${answersRaw}
];
`;

const dictFileContent = `// PENTÁGONO — Chutes VÁLIDOS oficiais.
import { ANSWERS } from './words';

const RAW_VALID_GUESSES: string[] = [
  ${validRaw}
];

function normalize(word: string): string {
  return word
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase();
}

export const VALID_GUESSES: Set<string> = new Set([
  ...RAW_VALID_GUESSES.map(normalize),
  ...ANSWERS.map(normalize)
]);

export function isValidGuess(word: string): boolean {
  return VALID_GUESSES.has(normalize(word));
}
`;

fs.writeFileSync("lib/words.ts", wordsFileContent);
fs.writeFileSync("lib/dictionary.ts", dictFileContent);
console.log("Wrote lib/words.ts and lib/dictionary.ts");

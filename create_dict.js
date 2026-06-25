const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/pythonprobr/palavras/master/palavras.txt', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const words = data.split('\n');
    let words11 = words.map(w => w.trim().toLowerCase()).filter(w => w.length === 11);
    
    // Read ANSWERS_11 to include them
    const answersContent = fs.readFileSync('lib/words11.ts', 'utf8');
    const answersMatch = answersContent.match(/export const ANSWERS_11: string\[\] = \[([\s\S]*?)\];/);
    let answers = [];
    if (answersMatch) {
      answers = answersMatch[1].split(',')
        .map(w => w.trim().replace(/"/g, ''))
        .filter(w => w.length > 0);
    }

    const normalize = (word) => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const allWords = new Set([...words11.map(normalize), ...answers.map(normalize)]);
    const finalWords = Array.from(allWords);

    const dictFileContent = `// PENTÁGONO — Chutes VÁLIDOS (gerado dinamicamente).
// Inclui todas as ANSWERS_11. isValidGuess11 normaliza acento.

const RAW_VALID_GUESSES_11: string[] = [
  ${finalWords.map(w => `"${w}"`).join(', ')}
];

function normalize(word: string): string {
  return word.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
}

export const VALID_GUESSES_11: Set<string> = new Set(
  RAW_VALID_GUESSES_11.map(normalize)
);

export function isValidGuess11(word: string): boolean {
  return VALID_GUESSES_11.has(normalize(word));
}
`;

    fs.writeFileSync('lib/dictionary11.ts', dictFileContent);
    console.log('Created lib/dictionary11.ts with ' + finalWords.length + ' words.');
  });
});

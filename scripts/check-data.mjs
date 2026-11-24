#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SURAHS_DIR = path.resolve(process.cwd(), 'public/data/surahs');
const MANIFEST_PATH = path.resolve(process.cwd(), 'public/data/manifest.json');

const SKIP_KEYS = new Set([
  'arabicText',
  'arabic',
  'arabicRoot',
  'lemma',
  'root',
  'id',
  'archivePageUrl',
  'scholarlyReference',
  'grammarNote',
]);

const HYPHEN_PREFIX_ALLOWLIST = new Set([
  'al', 'ul', 'ash', 'as', 'at', 'ath', 'ad', 'ar', 'az', 'an', 'dhul',
  'abu', 'ibn', 'bin', 'abd', 'bi', 'li', 'fi', 'wa', 'ya', 'non', 'self',
  're', 'pre', 'sub', 'co', 'un', 'anti', 'semi', 'well', 'two', 'three',
  'four', 'five', 'six', 'seven', 'one', 'twenty', 'thirty', 'forty',
  'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'inter', 'all', 'ex',
  'quasi', 'mid', 'post', 'over', 'under', 'up', 'cross', 'half', 'full',
]);

function* iterEnglishFields(obj, fieldPath = '') {
  if (typeof obj === 'string') {
    yield [fieldPath, obj];
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      yield* iterEnglishFields(obj[i], `${fieldPath}[${i}]`);
    }
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (SKIP_KEYS.has(k)) continue;
      yield* iterEnglishFields(v, fieldPath ? `${fieldPath}.${k}` : k);
    }
  }
}

const errors = [];
const surahMap = new Map();

// 1. Validate manifest.json
try {
  JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
} catch (err) {
  errors.push(`manifest.json: invalid JSON (${err.message})`);
}

// 2. Validate all 114 surah JSONs
const files = fs
  .readdirSync(SURAHS_DIR)
  .filter((f) => /^\d{3}\.json$/.test(f))
  .sort();

if (files.length !== 114) {
  errors.push(`Expected 114 surah JSON files, found ${files.length}`);
}

for (const file of files) {
  const fullPath = path.join(SURAHS_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (err) {
    errors.push(`${file}: invalid JSON (${err.message})`);
    continue;
  }
  surahMap.set(data.number, data);

  for (const [fp, text] of iterEnglishFields(data)) {
    // Replacement / control characters
    if (/[\uFFFD\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) {
      errors.push(`${file} (${fp}): contains replacement or control character`);
    }

    // Stray '=' inside or attached to non-math words
    for (const m of text.matchAll(/\S*=\S*/g)) {
      const tok = m[0];
      if (tok === '=' || tok.startsWith('[=')) continue;
      if (/^=\d+(?:\.\d+)?$/.test(tok)) continue; // e.g. "=87.48" only if not preceded by bullet; check specifically
      errors.push(`${file} (${fp}): unexpected '=' token ${JSON.stringify(tok)}`);
    }

    // Digits embedded inside Latin words
    for (const m of text.matchAll(/\b(?=[A-Za-z0-9]*[A-Za-z])(?=[A-Za-z0-9]*[0-9])[A-Za-z0-9]+\b/g)) {
      const tok = m[0];
      if (/^\d+(?:st|nd|rd|th|s|g|gr|kg|mg|km|m|cm|mm|ml|l|oz|lb|am|pm|AH|CE|BC|x\d+)$/i.test(tok)) continue;
      if (/^pp\d+$/i.test(tok) || /^v\d+$/i.test(tok)) continue;
      errors.push(`${file} (${fp}): digit embedded in word ${JSON.stringify(tok)}`);
    }

    // Standalone '0' used for vocative 'O'
    for (const m of text.matchAll(/(?:^|[\s"“(\[`'])0\.?\s+[A-Za-z]{2,}/g)) {
      errors.push(`${file} (${fp}): standalone '0' before word ${JSON.stringify(m[0].trim())}`);
    }

    // Standalone '1' used as pronoun 'I'
    for (const m of text.matchAll(/\b1\s+(?:am|have|had|was|will|shall|do|did|would|could|should)\b/g)) {
      errors.push(`${file} (${fp}): standalone '1' used as pronoun 'I' (${JSON.stringify(m[0])})`);
    }

    // Broken hyphen + space: "word- word"
    for (const m of text.matchAll(/\b([A-Za-z]{2,})-\s+([a-z]{2,})\b/g)) {
      const w1 = m[1].toLowerCase();
      if (HYPHEN_PREFIX_ALLOWLIST.has(w1)) continue;
      errors.push(`${file} (${fp}): broken hyphen+space ${JSON.stringify(m[0])}`);
    }

    // AI- instead of Al-
    for (const m of text.matchAll(/\bAI-[A-Za-z'’]+/g)) {
      errors.push(`${file} (${fp}): OCR 'AI-' prefix ${JSON.stringify(m[0])}`);
    }

    // Arabic letter dropped inside English word
    for (const m of text.matchAll(/\b[A-Za-z]{1,4}\s+[\u0600-\u06CC\u06CE-\u06DC\u06DF-\u06FF]\s+[A-Za-z]{1,4}\b/g)) {
      errors.push(`${file} (${fp}): Arabic char inside English word ${JSON.stringify(m[0])}`);
    }

    // Broken Prophet honorific ligature glyph
    for (const m of text.matchAll(/\b(?:Holy Prophet [gtsuilIMo]|Muhammad [it]|Prophet ﷺ [a-z])\b/g)) {
      if (m[0] === 'Prophet ﷺ a') continue;
      errors.push(`${file} (${fp}): broken ﷺ ligature ${JSON.stringify(m[0])}`);
    }

    // Stray '}' inside word
    for (const m of text.matchAll(/[A-Za-z]+\}\s*[A-Za-z]*/g)) {
      errors.push(`${file} (${fp}): stray '}' in text ${JSON.stringify(m[0])}`);
    }
  }
}

// 3. Check cross-surah boundary bleeds
for (let n = 2; n <= 114; n++) {
  const prev = surahMap.get(n - 1);
  const curr = surahMap.get(n);
  if (!prev?.sections?.length || !curr?.sections?.length) continue;

  const prevLastComm = prev.sections[prev.sections.length - 1].commentary || '';
  const currFirstComm = curr.sections[0].commentary || '';
  const prevParas = new Set(
    prevLastComm
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 60)
  );
  const shared = currFirstComm
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => prevParas.has(p));

  if (shared.length > 0) {
    errors.push(
      `${String(n).padStart(3, '0')}.json (sections[0].commentary): ${shared.length} paragraph(s) bled from Surah ${n - 1}`
    );
  }
}

if (errors.length > 0) {
  console.error(`\n[check-data] Found ${errors.length} corpus quality issue(s):\n`);
  for (const e of errors.slice(0, 50)) {
    console.error(`  - ${e}`);
  }
  if (errors.length > 50) {
    console.error(`  ... and ${errors.length - 50} more.`);
  }
  process.exit(1);
}

console.log(`[check-data] Passed: ${files.length} surah files verified clean.`);

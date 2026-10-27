export interface ParsedHadithCitation {
  sourceName?: string;
  badgeLabel: string;
  fullCitation: string;
}

export interface HadithSourceRule {
  regex: RegExp;
  name: string;
  isPrimaryCompiler?: boolean;
}

export const HADITH_SOURCES: HadithSourceRule[] = [
  // Primary Canonical Hadith Compilers
  {
    regex: /\b(?:bukhari\s+(?:and|&)\s+muslim|muttafaqu?n?\s*['’`]?alayh|agreed\s+upon)\b/i,
    name: 'Sahih al-Bukhari & Muslim',
    isPrimaryCompiler: true,
  },
  { regex: /\b(?:sahih\s+al-)?bukhari\b/i, name: 'Sahih al-Bukhari', isPrimaryCompiler: true },
  { regex: /\b(?:sahih\s+)?muslim\b/i, name: 'Sahih Muslim', isPrimaryCompiler: true },
  {
    regex: /\b(?:jami['’`]?\s+(?:al-)?|sunan\s+(?:al-)?|imam\s+)?tirmidhi\b/i,
    name: "Jami' al-Tirmidhi",
    isPrimaryCompiler: true,
  },
  { regex: /\b(?:sunan\s+)?ab[ui]\s+daw(?:uu?|oo)d\b/i, name: 'Sunan Abi Dawud', isPrimaryCompiler: true },
  { regex: /\b(?:sunan\s+)?(?:al-)?nasa['’`]?i\b/i, name: "Sunan an-Nasa'i", isPrimaryCompiler: true },
  { regex: /\b(?:sunan\s+)?ibn\s+majah\b/i, name: 'Sunan Ibn Majah', isPrimaryCompiler: true },
  {
    regex: /\b(?:musnad\s+)?(?:imam\s+)?ahmad(?:\s+ibn\s+hanbal)?\b/i,
    name: 'Musnad Ahmad',
    isPrimaryCompiler: true,
  },
  { regex: /\b(?:muwatta\s+)?(?:imam\s+)?malik\b/i, name: 'Muwatta Malik', isPrimaryCompiler: true },
  { regex: /\b(?:sunan\s+)?(?:al-)?bayhaqi\b/i, name: 'Sunan al-Bayhaqi', isPrimaryCompiler: true },
  {
    regex: /\b(?:al-)?(?:mu['’`]?jam\s+al-)?tabarani\b/i,
    name: "Al-Mu'jam al-Tabarani",
    isPrimaryCompiler: true,
  },
  { regex: /\b(?:al-)?mustadrak(?:\s+al-hakim)?|\b(?:al-)?hakim\b/i, name: 'Al-Mustadrak', isPrimaryCompiler: true },
  { regex: /\b(?:sunan\s+)?(?:al-)?darimi\b/i, name: 'Sunan al-Darimi', isPrimaryCompiler: true },

  // Classical Exegeses / Secondary Sources when cited for Hadith
  { regex: /\b(?:tafsi[e-]?r\s+)?mazhari\b/i, name: 'Tafseer Mazhari' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?qurtubi\b/i, name: 'Tafseer al-Qurtubi' },
  { regex: /\b(?:tafsi[e-]?r\s+)?ibn\s+kathir\b/i, name: 'Tafseer Ibn Kathir' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?tabari|ibn\s+jarir\b/i, name: 'Tafseer al-Tabari' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?baghawi\b/i, name: 'Tafseer al-Baghawi' },
  { regex: /\bruh\s*(?:al-|ul-)?ma['’`]?ani\b/i, name: "Ruh al-Ma'ani" },
  { regex: /\bfat[a-z]*\s*(?:al-)?bari\b/i, name: 'Fath al-Bari' },
];

/**
 * Extracts the canonical compiler or source collection of a Hadith from the text.
 */
export function extractHadithSourceName(text?: string | null, explicitSource?: string | null): string | undefined {
  if (explicitSource) {
    for (const src of HADITH_SOURCES) {
      if (src.regex.test(explicitSource)) return src.name;
    }
    const clean = explicitSource.trim();
    if (clean.length > 2 && clean.length < 40 && !/^\d+$/.test(clean)) return clean;
  }

  if (!text) return undefined;

  // 1. First priority: Check for primary canonical Hadith collections in the text
  for (const src of HADITH_SOURCES) {
    if (src.isPrimaryCompiler && src.regex.test(text)) {
      return src.name;
    }
  }

  // 2. Second priority: Check parenthetical source at end (e.g. (See Qurtubi), (Mazhari), (Tirmidhi))
  const mEnd = text.match(/\((?:See\s+|Recorded\s+by\s+|Narrated\s+by\s+)?([^)]+)\)\s*[."”']*\s*$/i);
  if (mEnd) {
    const raw = mEnd[1].trim();
    for (const src of HADITH_SOURCES) {
      if (src.regex.test(raw)) return src.name;
    }
    if (raw.length > 2 && raw.length < 35 && !/^\d+(?::\d+)?$/.test(raw)) {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  // 3. Third priority: Check any secondary / commentary source in the text
  for (const src of HADITH_SOURCES) {
    if (src.regex.test(text)) {
      return src.name;
    }
  }

  return undefined;
}

/**
 * Parses Hadith text to produce a clean badge label and citation string.
 * Example badgeLabel: "Hadith · Sahih al-Bukhari", "Hadith · Jami' al-Tirmidhi", or "Hadith".
 */
export function parseHadithCitation(
  text: string,
  isQudsi: boolean = false,
  explicitSource?: string | null
): ParsedHadithCitation {
  const prefix = isQudsi ? 'Hadith Qudsi' : 'Hadith';
  const sourceName = extractHadithSourceName(text, explicitSource);

  return {
    sourceName,
    badgeLabel: sourceName ? `${prefix} · ${sourceName}` : prefix,
    fullCitation: sourceName ? `Recorded in ${sourceName}` : 'Recorded in Prophetic Traditions',
  };
}

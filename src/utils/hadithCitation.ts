export interface ParsedHadithCitation {
  sourceName?: string;
  narrator?: string;
  speaker: string;
  badgeLabel: string;
  fullCitation: string;
}

export interface HadithSourceRule {
  regex: RegExp;
  name: string;
  isPrimaryCompiler?: boolean;
}

export interface HadithNarratorRule {
  regex: RegExp;
  name: string;
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
  { regex: /\bmishkat(?:\s+al-masabih)?\b/i, name: 'Mishkat al-Masabih', isPrimaryCompiler: true },

  // Classical Exegeses / Secondary Sources when cited for Hadith
  { regex: /\b(?:tafsi[e-]?r\s+)?mazhari\b/i, name: 'Tafseer Mazhari' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?qurtubi\b/i, name: 'Tafseer al-Qurtubi' },
  { regex: /\b(?:tafsi[e-]?r\s+)?ibn\s+kathir\b/i, name: 'Tafseer Ibn Kathir' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?tabari|ibn\s+jarir\b/i, name: 'Tafseer al-Tabari' },
  { regex: /\b(?:tafsi[e-]?r\s+)?(?:al-)?baghawi\b/i, name: 'Tafseer al-Baghawi' },
  { regex: /\bruh\s*(?:al-|ul-)?ma['’`]?ani\b/i, name: "Ruh al-Ma'ani" },
  { regex: /\bfat[a-z]*\s*(?:al-)?bari\b/i, name: 'Fath al-Bari' },
  { regex: /\b(?:al-)?khasa['’`]?is\s+al-kubra\b/i, name: "Al-Khasa'is al-Kubra" },
  { regex: /\bsharh\s+al-sunnah\b/i, name: 'Sharh al-Sunnah' },
  { regex: /\b(?:imam\s+)?tahawi|sharh\s+ma['’`]?ani\s+al-athar\b/i, name: "Sharh Ma'ani al-Athar" },
  { regex: /\bibn\s+abi\s+hatim\b/i, name: 'Ibn Abi Hatim' },
  { regex: /\bibn\s+abi\s+shaybah\b/i, name: 'Musannaf Ibn Abi Shaybah' },
];

export const HADITH_NARRATORS: HadithNarratorRule[] = [
  { regex: /\b(?:abu\s+hurairah|abu\s+huraira)\b/i, name: 'Sayyidina Abu Hurairah ؓ' },
  { regex: /\b(?:ibn\s+['’`]?abbas|abdullah\s+ibn\s+['’`]?abbas)\b/i, name: "Sayyidina Ibn 'Abbas ؓ" },
  { regex: /\b(?:['’`]?a['’`]?ishah|['’`]?ayesha|sayyidah\s+['’`]?a['’`]?ishah)\b/i, name: "Sayyidah 'A'ishah ؓ" },
  { regex: /\b(?:abu\s+umamah|abu\s+umama)\b/i, name: 'Sayyidina Abu Umamah ؓ' },
  { regex: /\b(?:ibn\s+mas['’`]?ud|abdullah\s+ibn\s+mas['’`]?ud)\b/i, name: "Sayyidina Ibn Mas'ud ؓ" },
  { regex: /\b(?:['’`]?umar(?:\s+ibn\s+al-khattab)?|sayyidna\s+['’`]?umar)\b/i, name: "Sayyidina 'Umar ؓ" },
  { regex: /\b(?:['’`]?ali(?:\s+ibn\s+abi\s+talib)?|sayyidna\s+['’`]?ali)\b/i, name: "Sayyidina 'Ali ؓ" },
  { regex: /\b(?:anas(?:\s+ibn\s+malik)?|sayyidna\s+anas|hadrat\s+anas)\b/i, name: 'Sayyidina Anas ibn Malik ؓ' },
  { regex: /\b(?:abu\s+sa['’`]?id\s+al-khudri)\b/i, name: "Sayyidina Abu Sa'id al-Khudri ؓ" },
  { regex: /\b(?:jabir(?:\s+ibn\s+['’`]?abdullah)?|sayyidna\s+jabir)\b/i, name: "Sayyidina Jabir ibn 'Abdullah ؓ" },
  { regex: /\b(?:mu['’`]?adh\s+ibn\s+jabal)\b/i, name: "Sayyidina Mu'adh ibn Jabal ؓ" },
  { regex: /\b(?:abu\s+dharr(?:\s+al-ghifari)?)\b/i, name: 'Sayyidina Abu Dharr ؓ' },
  { regex: /\b(?:ubayy\s+ibn\s+ka['’`]?b)\b/i, name: "Sayyidina Ubayy ibn Ka'b ؓ" },
  { regex: /\b(?:salman\s+al-farsi)\b/i, name: 'Sayyidina Salman al-Farsi ؓ' },
  { regex: /\b(?:hudhayfah|hudhaifa)\b/i, name: 'Sayyidina Hudhayfah ؓ' },
  { regex: /\b(?:zayd\s+ibn\s+thabit)\b/i, name: 'Sayyidina Zayd ibn Thabit ؓ' },
  { regex: /\b(?:ibn\s+['’`]?umar|abdullah\s+ibn\s+['’`]?umar)\b/i, name: "Sayyidina Ibn 'Umar ؓ" },
  { regex: /\b(?:abu\s+bakr(?:\s+al-siddiq)?)\b/i, name: 'Sayyidina Abu Bakr ؓ' },
  { regex: /\b(?:amr\s+ibn\s+al-['’`]?as)\b/i, name: "Sayyidina 'Amr ibn al-'As ؓ" },
  { regex: /\b(?:bilal(?:\s+ibn\s+rabah)?)\b/i, name: 'Sayyidina Bilal ؓ' },
  { regex: /\b(?:abu\s+darda['’`]?)\b/i, name: 'Sayyidina Abu Darda ؓ' },
  { regex: /\b(?:bara['’`]?\s+ibn\s+['’`]?azib)\b/i, name: "Sayyidina Bara' ibn 'Azib ؓ" },
  { regex: /\b(?:samurah\s+ibn\s+jundub)\b/i, name: 'Sayyidina Samurah ibn Jundub ؓ' },
  { regex: /\b(?:thawban)\b/i, name: 'Sayyidina Thawban ؓ' },
  { regex: /\b(?:wa['’`]?il\s+ibn\s+hujr)\b/i, name: "Sayyidina Wa'il ibn Hujr ؓ" },
  { regex: /\b(?:sahl\s+ibn\s+sa['’`]?d)\b/i, name: "Sayyidina Sahl ibn Sa'd ؓ" },
];

/**
 * Extracts the companion narrator of a Hadith from the text.
 */
export function extractHadithNarrator(text?: string | null): string | undefined {
  if (!text) return undefined;

  for (const rule of HADITH_NARRATORS) {
    if (rule.regex.test(text)) {
      return rule.name;
    }
  }

  // Dynamic regex fallback for other companion names
  const m = text.match(
    /(?:from|narrated by|reported by|relat(?:ed)? by)\s+(?:the\s+blessed\s+Companion\s+|Sayyid(?:na|ina)\s+|Hadrat\s+)?([A-Z][a-zA-Z'`-]+(?:\s+[A-Z][a-zA-Z'`-]+)?)(?=\s+(?:that|who|when|reported|narrated|said|appearing|\(|,|ؓ|$))/i
  );
  if (m && m[1]) {
    const raw = m[1].trim();
    if (
      !/^(the|a|an|allah|holy|prophet|messenger|islam|this|that|he|she|they|each|all|some|another|one|two|three)$/i.test(
        raw
      )
    ) {
      return `Sayyidina ${raw} ؓ`;
    }
  }

  return undefined;
}

/**
 * Extracts the canonical compiler or source collection of a Hadith from the text.
 */
export function extractHadithSourceName(
  text?: string | null,
  explicitSource?: string | null
): string | undefined {
  if (explicitSource) {
    for (const src of HADITH_SOURCES) {
      if (src.regex.test(explicitSource)) return src.name;
    }
    const clean = explicitSource.trim();
    if (clean.length > 2 && clean.length < 40 && !/^\d+$/.test(clean)) return clean;
  }

  if (!text) return undefined;

  // 1. Check if multiple primary collections are mentioned (e.g. Abu Dawud and Tirmidhi)
  const matchedCompilers: string[] = [];
  for (const src of HADITH_SOURCES) {
    if (src.isPrimaryCompiler && src.regex.test(text)) {
      if (!matchedCompilers.includes(src.name)) {
        matchedCompilers.push(src.name);
      }
    }
  }

  if (matchedCompilers.length >= 2) {
    if (
      matchedCompilers.includes('Sahih al-Bukhari & Muslim') ||
      (matchedCompilers.includes('Sahih al-Bukhari') && matchedCompilers.includes('Sahih Muslim'))
    ) {
      return 'Sahih al-Bukhari & Muslim';
    }
    return matchedCompilers.slice(0, 2).join(' & ');
  } else if (matchedCompilers.length === 1) {
    return matchedCompilers[0];
  }

  // 2. Check parenthetical source at end (e.g. (See Qurtubi), (Mazhari), (Tirmidhi))
  const mEnd = text.match(
    /\((?:See\s+|Recorded\s+by\s+|Narrated\s+by\s+)?([^)]+)\)\s*[."”']*\s*$/i
  );
  if (mEnd) {
    const raw = mEnd[1].trim();
    for (const src of HADITH_SOURCES) {
      if (src.regex.test(raw)) return src.name;
    }
    if (raw.length > 2 && raw.length < 35 && !/^\d+(?::\d+)?$/.test(raw)) {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  // 3. Check any secondary / commentary source in the text
  for (const src of HADITH_SOURCES) {
    if (src.regex.test(text)) {
      return src.name;
    }
  }

  return undefined;
}

/**
 * Parses Hadith text to identify narrator and source collection, producing a
 * clean badge label and complete citation listing who said it and what book it comes from.
 */
export function parseHadithCitation(
  text: string,
  isQudsi: boolean = false,
  explicitSource?: string | null
): ParsedHadithCitation {
  const sourceName = extractHadithSourceName(text, explicitSource);
  const narrator = extractHadithNarrator(text);

  const prefix = isQudsi ? 'Hadith Qudsi' : 'Hadith';
  const badgeLabel = sourceName ? `${prefix} · ${sourceName}` : prefix;

  let fullCitation: string;
  if (isQudsi) {
    if (sourceName && narrator) {
      fullCitation = `${narrator} · Words of Allah (Hadith Qudsi) · ${sourceName}`;
    } else if (sourceName) {
      fullCitation = `Words of Allah (Hadith Qudsi) · ${sourceName}`;
    } else if (narrator) {
      fullCitation = `${narrator} · Words of Allah (Hadith Qudsi)`;
    } else {
      fullCitation = 'Words of Allah (Hadith Qudsi) · The Holy Prophet ﷺ';
    }
  } else {
    if (narrator && sourceName) {
      fullCitation = `${narrator} · ${sourceName}`;
    } else if (sourceName) {
      fullCitation = `The Holy Prophet ﷺ · ${sourceName}`;
    } else if (narrator) {
      fullCitation = `${narrator} · Prophetic Hadith`;
    } else {
      fullCitation = 'The Holy Prophet ﷺ · Prophetic Hadith';
    }
  }

  return {
    sourceName,
    narrator,
    speaker: isQudsi ? 'Words of Allah (Hadith Qudsi)' : narrator || 'The Holy Prophet ﷺ',
    badgeLabel,
    fullCitation,
  };
}

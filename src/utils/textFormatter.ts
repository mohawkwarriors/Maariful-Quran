/**
 * Text formatter to ensure that whenever classical Islamic/Arabic terms appear in insights,
 * definitions, or grammar notes, the term is displayed with its Arabic script,
 * followed by the English transliteration in parentheses, followed by its definition.
 * 
 * Example: "Active participle derived from Wiqayah" -> "Active participle derived from وقاية (Wiqayah)"
 */

interface ArabicTermMapping {
  arabic: string;
  transliteration: string;
  definition?: string;
}

export const ARABIC_TERM_REGISTRY: Record<string, ArabicTermMapping> = {
  wiqayah: { arabic: 'وقاية', transliteration: 'Wiqayah', definition: 'placing a protective shield against harm' },
  taqwa: { arabic: 'تقوى', transliteration: 'Taqwa', definition: 'God-consciousness and pious vigilance' },
  muttaqin: { arabic: 'المتقين', transliteration: 'Al-Muttaqin', definition: 'those who shield themselves with piety' },
  kufr: { arabic: 'كفر', transliteration: 'Kufr', definition: 'to cover, conceal, or bury the truth' },
  kaffar: { arabic: 'كفار', transliteration: 'Kaffar', definition: 'one who stubbornly buries the truth' },
  kafaru: { arabic: 'كفروا', transliteration: 'Kafaru', definition: 'they willfully rejected and concealed the truth' },
  kafir: { arabic: 'كافر', transliteration: 'Kafir', definition: 'one who actively conceals truth / disbeliever' },
  khatm: { arabic: 'ختم', transliteration: 'Khatm', definition: 'sealing or stamping firmly closed' },
  ghishawah: { arabic: 'غشاوة', transliteration: 'Ghishawah', definition: 'an opaque cataract veil or spiritual barrier' },
  nifaq: { arabic: 'نفاق', transliteration: 'Nifaq', definition: 'subterranean duplicity / outward hypocrisy' },
  munafiq: { arabic: 'منافق', transliteration: 'Munafiq', definition: 'hypocrite who enters through one door and exits another' },
  munafiqin: { arabic: 'المنافقين', transliteration: 'Al-Munafiqin', definition: 'the hypocrites' },
  marad: { arabic: 'مرض', transliteration: 'Marad', definition: 'chronic spiritual ailment and moral decay' },
  andad: { arabic: 'أنداد', transliteration: 'Andad', definition: 'rival peers, counterfeits, and false deities' },
  nidd: { arabic: 'ند', transliteration: 'Nidd', definition: 'an equal or rival partner' },
  fitrah: { arabic: 'فطرة', transliteration: 'Fitrah', definition: 'primordial innate disposition toward monotheism' },
  ibadah: { arabic: 'عبادة', transliteration: 'Ibadah', definition: 'utmost humility coupled with supreme love and devotion' },
  iman: { arabic: 'إيمان', transliteration: 'Iman', definition: 'unhesitating heart-conviction coupled with oral confession' },
  ghayb: { arabic: 'غيب', transliteration: 'Ghayb', definition: 'unseen celestial and metaphysical realities' },
  salah: { arabic: 'صلاة', transliteration: 'Salah', definition: 'prescribed ritual supplication and divine link' },
  infaq: { arabic: 'إنفاق', transliteration: 'Infaq', definition: 'spending from divinely bestowed provision' },
  zakah: { arabic: 'زكاة', transliteration: 'Zakah', definition: 'annual purifying dues of wealth' },
  sadaqah: { arabic: 'صدقة', transliteration: 'Sadaqah', definition: 'voluntary spending verifying sincerity of faith' },
  riba: { arabic: 'ربا', transliteration: 'Riba', definition: 'unearned surplus and exploitative usury' },
  fasad: { arabic: 'فساد', transliteration: 'Fasad', definition: 'corruption, rot, and socio-moral disruption' },
  islah: { arabic: 'إصلاح', transliteration: 'Islah', definition: 'righteous reform, healing, and reconciliation' },
  yaqin: { arabic: 'يقين', transliteration: 'Yaqin', definition: 'unshakable certainty free from all conjecture' },
  tawfiq: { arabic: 'توفيق', transliteration: 'Tawfiq', definition: 'divine enablement and facilitation toward righteousness' },
  sabr: { arabic: 'صبر', transliteration: 'Sabr', definition: 'steadfast endurance and self-restraint' },
  shukr: { arabic: 'شكر', transliteration: 'Shukr', definition: 'grateful acknowledgment of divine benevolence' },
  tawbah: { arabic: 'توبة', transliteration: 'Tawbah', definition: 'sincere repentance and returning to Allah' },
  iqamah: { arabic: 'إقامة', transliteration: 'Iqamah', definition: 'establishing with devotion, timeliness, and precision' },
  iltifat: { arabic: 'التفات', transliteration: 'Iltifat', definition: 'rhetorical apostrophe shifting grammatical perspective' },
  tafwid: { arabic: 'تفويض', transliteration: 'Tafwid', definition: 'submitting the secret reality of letters to Allah' },
  rayb: { arabic: 'ريب', transliteration: 'Rayb', definition: 'restless doubt, suspicion, and agitation' },
  falah: { arabic: 'فلاح', transliteration: 'Falah', definition: 'ultimate triumph and everlasting salvation in Paradise' },
};

/**
 * Replaces standalone occurrences of recognized English transliterated terms with
 * Arabic text + (English transliteration), ensuring no double-formatting.
 */
export function formatArabicEnglishInsight(text: string): string {
  if (!text) return text;

  let result = text;

  // Process longer phrases first to prevent partial replacements
  const sortedKeys = Object.keys(ARABIC_TERM_REGISTRY).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const entry = ARABIC_TERM_REGISTRY[key];
    const trans = entry.transliteration;
    const arabic = entry.arabic;

    // Pattern matches:
    // "derived from Wiqayah" or "Wiqayah: definition" or "from Wiqayah"
    // But avoids touching text that already has Arabic preceding or enclosing it
    const escapedTrans = trans.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // If already preceded by the Arabic word, skip
    const alreadyFormattedRegex = new RegExp(`${arabic}\\s*\\(${escapedTrans}\\)`, 'i');
    if (alreadyFormattedRegex.test(result)) {
      continue;
    }

    // Match word boundaries: e.g. " Wiqayah" or "(Wiqayah)" or "from Wiqayah:"
    const termRegex = new RegExp(`(?<![\u0600-\u06FF\\w])${escapedTrans}(?![\u0600-\u06FF\\w])`, 'gi');

    result = result.replace(termRegex, `${arabic} (${trans})`);
  }

  return result;
}

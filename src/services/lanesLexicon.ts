/**
 * Classical Arabic Root & Lexicography Service
 * Powered by Edward William Lane's Arabic-English Lexicon (مدّ القاموس - Madd al-Qāmūs)
 * and ejtaal.net (Arabic Almanac / Mawrid Reader)
 */

export interface LanesRelatedWord {
  arabic: string;
  transliteration: string;
  meaning: string;
}

export interface LanesVerseReference {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  reference: string;
  arabicSnippet?: string;
  englishText: string;
}

export interface LanesRootEntry {
  arabicLetters: string; // e.g. "ق - و - ل"
  transliteration: string; // e.g. "Q-W-L"
  laneDefinition: string;
  lanePage?: string; // e.g. "Book 1, p. 2995"
  classicalNuances?: string[];
  relatedWords?: LanesRelatedWord[];
  otherQuranVerses?: LanesVerseReference[];
}

/**
 * Normalizes any root string by extracting pure Arabic letters without dashes, spaces, or Latin transliteration.
 * Example: "ق - و - ل" -> "قول", "س - م - و (S-M-W)" -> "سمو", "أ - ل - ه" -> "اله"
 */
export function getCleanArabicRoot(rootStr?: string): string {
  if (!rootStr) return '';
  return rootStr
    .replace(/[^\u0600-\u06FF]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .trim();
}

/**
 * Formats root into clean spaced letters (e.g. "ق - و - ل")
 */
export function formatArabicRootSpaced(rootStr?: string): string {
  if (!rootStr) return '';
  const clean = rootStr.replace(/[^\u0600-\u06FF]/g, '').trim();
  if (!clean) return rootStr.trim();
  return clean.split('').join(' - ');
}

/**
 * Constructs direct URL to Edward William Lane's Arabic-English Lexicon via ejtaal.net Arabic Almanac.
 * The #q parameter queries the entire classical index including Lane's Lexicon, Hans Wehr, and Lisan al-Arab.
 */
export function getEjtaalUrl(rootStr?: string): string {
  if (!rootStr) return 'https://ejtaal.net/aa/';
  const rawClean = rootStr.replace(/[^\u0600-\u06FF]/g, '').trim();
  if (!rawClean) return 'https://ejtaal.net/aa/';
  return `https://ejtaal.net/aa/#q=${encodeURIComponent(rawClean)}`;
}

/**
 * Common Classical Arabic particles, prepositions, and pronouns that do not have
 * triliteral roots in classical lexicography (al-huruf la tashtaqqu).
 */
export const PSEUDO_PARTICLE_ROOTS = new Set([
  'فيه', 'في', 'من', 'عن', 'على', 'الي', 'الى', 'حتى',
  'لا', 'ما', 'ان', 'لن', 'لم', 'لما', 'كي',
  'ثم', 'او', 'ام', 'بل', 'لكن',
  'ذلك', 'ذالك', 'ذاك', 'تلك', 'هذا', 'هذه', 'هولاء', 'اولئك',
  'الذي', 'التي', 'الذين',
  'هو', 'هي', 'هم', 'هن', 'هما', 'انا', 'نحن', 'انت', 'انتم'
]);

export function isClassicalParticle(word?: string, root?: string, grammar?: string): boolean {
  if (root) {
    const cleanRoot = getCleanArabicRoot(root);
    if (PSEUDO_PARTICLE_ROOTS.has(cleanRoot)) return true;
  }
  if (word) {
    const cleanWord = getCleanArabicRoot(word);
    if (PSEUDO_PARTICLE_ROOTS.has(cleanWord)) return true;
  }
  if (grammar && /(preposition|particle|pronoun|conjunction|حرف|اسم إشارة|اسم موصول|ضمير)/i.test(grammar)) {
    const cleanRoot = getCleanArabicRoot(root);
    if (!cleanRoot || PSEUDO_PARTICLE_ROOTS.has(cleanRoot)) return true;
  }
  return false;
}

/**
 * Curated classical definitions from Edward William Lane's Arabic-English Lexicon
 * Keyed by normalized Arabic root letters.
 */
export const LANES_ROOT_KNOWLEDGE: Record<string, LanesRootEntry> = {
  'قول': {
    arabicLetters: 'ق - و - ل',
    transliteration: 'Q-W-L',
    laneDefinition: 'To say, utter, articulate, pronounce; foundational classical root for speech, dictation, and divine proclamation.',
    lanePage: 'Book 1, p. 2995',
    relatedWords: [
      { arabic: 'قَالَ', transliteration: 'Qāla', meaning: 'He said / articulated' },
      { arabic: 'يَقُولُ', transliteration: 'Yaqūlu', meaning: 'He says / states' },
      { arabic: 'قَوْل', transliteration: 'Qawl', meaning: 'Word, utterance, speech' },
      { arabic: 'أَقْوَال', transliteration: 'Aqwāl', meaning: 'Sayings, statements' }
    ],
    otherQuranVerses: [
      { surahNumber: 112, surahName: 'Al-Ikhlas', verseNumber: 1, reference: '112:1', arabicSnippet: 'قُلْ هُوَ اللَّهُ أَحَدٌ', englishText: 'Say, He is Allah, [who is] One.' },
      { surahNumber: 113, surahName: 'Al-Falaq', verseNumber: 1, reference: '113:1', arabicSnippet: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', englishText: 'Say, I seek refuge in the Lord of daybreak.' },
      { surahNumber: 109, surahName: 'Al-Kafirun', verseNumber: 1, reference: '109:1', arabicSnippet: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', englishText: 'Say, O disbelievers.' }
    ]
  },
  'عوذ': {
    arabicLetters: 'ع - و - ذ',
    transliteration: 'ʿ-W-Dh',
    laneDefinition: 'To take refuge, betake oneself for shelter, seek haven against peril, cleave to a protective sanctuary.',
    lanePage: 'Book 1, p. 2192',
    relatedWords: [
      { arabic: 'عَاذَ', transliteration: 'ʿĀdha', meaning: 'He took refuge / sought haven' },
      { arabic: 'مَعَاذ', transliteration: 'Maʿādh', meaning: 'Place of refuge / sanctuary' },
      { arabic: 'تَعَوُّذ', transliteration: 'Taʿawwudh', meaning: 'Seeking divine protection' }
    ],
    otherQuranVerses: [
      { surahNumber: 113, surahName: 'Al-Falaq', verseNumber: 1, reference: '113:1', arabicSnippet: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', englishText: 'Say, I seek refuge in the Lord of daybreak.' },
      { surahNumber: 7, surahName: 'Al-A\'raf', verseNumber: 200, reference: '7:200', arabicSnippet: 'وَإِمَّا يَنزَغَنَّكَ مِنَ الشَّيْطَانِ نَزْغٌ فَاسْتَعِذْ بِاللَّهِ', englishText: 'And if an evil suggestion comes to you from Satan, then seek refuge in Allah.' }
    ]
  },
  'ربب': {
    arabicLetters: 'ر - ب - ب',
    transliteration: 'R-B-B',
    laneDefinition: 'To foster, nourish, rear, bring up gradually toward perfection; to possess supreme dominion, sustain, and govern.',
    lanePage: 'Book 1, p. 1004',
    relatedWords: [
      { arabic: 'رَبّ', transliteration: 'Rabb', meaning: 'Lord, Sustainer, Nurturer' },
      { arabic: 'رُبُوبِيَّة', transliteration: 'Rubūbiyyah', meaning: 'Divine Lordship and providential care' },
      { arabic: 'رَبِيب', transliteration: 'Rabīb', meaning: 'Foster-child reared with care' }
    ],
    otherQuranVerses: [
      { surahNumber: 1, surahName: 'Al-Fatihah', verseNumber: 2, reference: '1:2', arabicSnippet: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', englishText: 'Praise be to Allah, Lord of the worlds.' },
      { surahNumber: 113, surahName: 'Al-Falaq', verseNumber: 1, reference: '113:1', arabicSnippet: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', englishText: 'Say, I seek refuge with the Lord of the daybreak.' }
    ]
  },
  'نوس': {
    arabicLetters: 'ن - و - س',
    transliteration: 'N-W-S',
    laneDefinition: 'To swing, sway, move to and fro; mankind (Al-Nās) as dynamic mortal beings possessing movement and social affinity.',
    lanePage: 'Book 1, p. 2867',
    relatedWords: [
      { arabic: 'النَّاس', transliteration: 'Al-Nās', meaning: 'Mankind, humanity, people' },
      { arabic: 'إِنسَان', transliteration: 'Insān', meaning: 'Human being' },
      { arabic: 'إِنس', transliteration: 'Ins', meaning: 'Mankind as opposed to jinn' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 21, reference: '2:21', arabicSnippet: 'يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ', englishText: 'O mankind, worship your Lord.' },
      { surahNumber: 103, surahName: 'Al-Asr', verseNumber: 2, reference: '103:2', arabicSnippet: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', englishText: 'Indeed, mankind is in loss.' }
    ]
  },
  'ملك': {
    arabicLetters: 'م - ل - ك',
    transliteration: 'M-L-K',
    laneDefinition: 'To possess, hold dominion, command authority, have sovereign rule, reign over subjects without restriction.',
    lanePage: 'Book 1, p. 3020',
    relatedWords: [
      { arabic: 'مَلِك', transliteration: 'Malik', meaning: 'Sovereign King, Monarch' },
      { arabic: 'مَالِك', transliteration: 'Mālik', meaning: 'Owner, Possessor' },
      { arabic: 'مُلْك', transliteration: 'Mulk', meaning: 'Dominion, Kingdom, Sovereignty' }
    ],
    otherQuranVerses: [
      { surahNumber: 1, surahName: 'Al-Fatihah', verseNumber: 4, reference: '1:4', arabicSnippet: 'مَالِكِ يَوْمِ الدِّينِ', englishText: 'Sovereign of the Day of Recompense.' },
      { surahNumber: 67, surahName: 'Al-Mulk', verseNumber: 1, reference: '67:1', arabicSnippet: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ', englishText: 'Blessed is He in whose hand is dominion.' }
    ]
  },
  'اله': {
    arabicLetters: 'إ - ل - ه',
    transliteration: 'ʾ-L-H',
    laneDefinition: 'To worship, adore with supreme love and reverential awe; to take refuge in when bewildered or desperate.',
    lanePage: 'Book 1, p. 82',
    relatedWords: [
      { arabic: 'إِلَٰه', transliteration: 'Ilāh', meaning: 'God, deity worthy of worship' },
      { arabic: 'اللَّه', transliteration: 'Allāh', meaning: 'The One True Supreme God' },
      { arabic: 'أُلُوهِيَّة', transliteration: 'Ulūhiyyah', meaning: 'Exclusive Divine Worship' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 163, reference: '2:163', arabicSnippet: 'وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ', englishText: 'And your god is one God.' },
      { surahNumber: 112, surahName: 'Al-Ikhlas', verseNumber: 1, reference: '112:1', arabicSnippet: 'قُلْ هُوَ اللَّهُ أَحَدٌ', englishText: 'Say, He is Allah, [who is] One.' }
    ]
  },
  'شرر': {
    arabicLetters: 'ش - ر - ر',
    transliteration: 'Sh-R-R',
    laneDefinition: 'Evil, injury, malice, active corruption, that which produces disadvantage and peril.',
    lanePage: 'Book 1, p. 1526',
    relatedWords: [
      { arabic: 'شَرّ', transliteration: 'Sharr', meaning: 'Evil, harm, wickedness' },
      { arabic: 'أَشْرَار', transliteration: 'Ashrār', meaning: 'Wicked / evil persons' }
    ],
    otherQuranVerses: [
      { surahNumber: 113, surahName: 'Al-Falaq', verseNumber: 2, reference: '113:2', arabicSnippet: 'مِن شَرِّ مَا خَلَقَ', englishText: 'From the evil of that which He created.' },
      { surahNumber: 99, surahName: 'Az-Zalzalah', verseNumber: 8, reference: '99:8', arabicSnippet: 'وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ', englishText: 'And whoever does an atom\'s weight of evil will see it.' }
    ]
  },
  'وسوس': {
    arabicLetters: 'و - س - و - س',
    transliteration: 'W-S-W-S',
    laneDefinition: 'To whisper insidiously, make a faint rustling or covert murmur; insidious suggestions repeated to stir hidden desires.',
    lanePage: 'Book 1, p. 3054',
    relatedWords: [
      { arabic: 'وَسْوَاس', transliteration: 'Waswās', meaning: 'The whisperer who casts doubt' },
      { arabic: 'وَسْوَسَة', transliteration: 'Waswasah', meaning: 'Insidious whispering, doubt' },
      { arabic: 'يُوَسْوِسُ', transliteration: 'Yuwaswisu', meaning: 'He whispers insidious suggestions' }
    ],
    otherQuranVerses: [
      { surahNumber: 7, surahName: 'Al-A\'raf', verseNumber: 20, reference: '7:20', arabicSnippet: 'فَوَسْوَسَ لَهُمَا الشَّيْطَانُ', englishText: 'Then Satan whispered to them both.' },
      { surahNumber: 20, surahName: 'Ta-Ha', verseNumber: 120, reference: '20:120', arabicSnippet: 'فَوَسْوَسَ إِلَيْهِ الشَّيْطَانُ', englishText: 'Then Satan whispered to him.' }
    ]
  },
  'خنس': {
    arabicLetters: 'خ - ن - س',
    transliteration: 'Kh-N-S',
    laneDefinition: 'To withdraw, shrink back, recede, slink away stealthily upon encountering light or the remembrance of God.',
    lanePage: 'Book 1, p. 811',
    relatedWords: [
      { arabic: 'خَنَّاس', transliteration: 'Khannās', meaning: 'The one who constantly slinks away and retreats' },
      { arabic: 'خُنَّس', transliteration: 'Khunnas', meaning: 'Planets receding from sight' }
    ],
    otherQuranVerses: [
      { surahNumber: 81, surahName: 'At-Takwir', verseNumber: 15, reference: '81:15', arabicSnippet: 'فَلَا أُقْسِمُ بِالْخُنَّسِ', englishText: 'So I swear by the retreating stars.' }
    ]
  },
  'فلق': {
    arabicLetters: 'ف - ل - ق',
    transliteration: 'F-L-Q',
    laneDefinition: 'To split, cleave asunder, burst forth into light; daybreak cleaving the gloom of night.',
    lanePage: 'Book 1, p. 2441',
    relatedWords: [
      { arabic: 'فَلَق', transliteration: 'Falaq', meaning: 'Daybreak, morning light' },
      { arabic: 'فَالِق', transliteration: 'Fāliq', meaning: 'Cleaver of dawn and seeds' }
    ],
    otherQuranVerses: [
      { surahNumber: 6, surahName: 'Al-An\'am', verseNumber: 95, reference: '6:95', arabicSnippet: 'إِنَّ اللَّهَ فَالِقُ الْحَبِّ وَالنَّوَىٰ', englishText: 'Indeed, Allah is the cleaver of grain and date seeds.' }
    ]
  },
  'حسد': {
    arabicLetters: 'ح - س - د',
    transliteration: 'Ḥ-S-D',
    laneDefinition: 'To envy, begrudge another person their blessing and desire that they be deprived of it.',
    lanePage: 'Book 1, p. 570',
    relatedWords: [
      { arabic: 'حَاسِد', transliteration: 'Ḥāsid', meaning: 'Envier' },
      { arabic: 'حَسَد', transliteration: 'Ḥasad', meaning: 'Malignant envy' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 109, reference: '2:109', arabicSnippet: 'حَسَدًا مِّنْ عِندِ أَنفُسِهِم', englishText: 'Out of envy from their own souls.' }
    ]
  },
  'احد': {
    arabicLetters: 'أ - ح - د',
    transliteration: 'ʾ-Ḥ-D',
    laneDefinition: 'Sole, indivisible, unique, having no component parts, partner, or peer in essence or attributes.',
    lanePage: 'Book 1, p. 26',
    relatedWords: [
      { arabic: 'أَحَد', transliteration: 'Aḥad', meaning: 'The One, Indivisible' },
      { arabic: 'وَاحِد', transliteration: 'Wāḥid', meaning: 'Single, One' }
    ],
    otherQuranVerses: [
      { surahNumber: 112, surahName: 'Al-Ikhlas', verseNumber: 1, reference: '112:1', arabicSnippet: 'قُلْ هُوَ اللَّهُ أَحَدٌ', englishText: 'Say, He is Allah, [who is] One.' }
    ]
  },
  'صمد': {
    arabicLetters: 'ص - م - د',
    transliteration: 'Ṣ-M-D',
    laneDefinition: 'The Eternal Refuge, the Lord to whom recourse is had in all affairs, solid without void, self-sufficient.',
    lanePage: 'Book 1, p. 1726',
    relatedWords: [
      { arabic: 'الصَّمَد', transliteration: 'Al-Ṣamad', meaning: 'The Eternal Refuge turned to in all needs' }
    ],
    otherQuranVerses: [
      { surahNumber: 112, surahName: 'Al-Ikhlas', verseNumber: 2, reference: '112:2', arabicSnippet: 'اللَّهُ الصَّمَدُ', englishText: 'Allah, the Eternal Refuge.' }
    ]
  },
  'كتب': {
    arabicLetters: 'ك - ت - ب',
    transliteration: 'K-T-B',
    laneDefinition: 'To draw together, join parts, stitch, inscribe, decree firmly with permanent obligation.',
    lanePage: 'Book 1, p. 2589',
    relatedWords: [
      { arabic: 'كِتَاب', transliteration: 'Kitāb', meaning: 'Book, Scripture, Decree' },
      { arabic: 'كَتَبَ', transliteration: 'Kataba', meaning: 'He inscribed / decreed' },
      { arabic: 'كَاتِب', transliteration: 'Kātib', meaning: 'Scribe, writer' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 2, reference: '2:2', arabicSnippet: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ', englishText: 'That is the Book about which there is no doubt.' }
    ]
  },
  'ريب': {
    arabicLetters: 'ر - ي - ب',
    transliteration: 'R-Y-B',
    laneDefinition: 'Disquieting agitation of mind, suspicion, suspicion causing restless disturbance.',
    lanePage: 'Book 1, p. 1205',
    relatedWords: [
      { arabic: 'رَيْب', transliteration: 'Rayb', meaning: 'Doubt, suspicion, disquiet' },
      { arabic: 'مُرِيب', transliteration: 'Murīb', meaning: 'Disturbing, disquieting' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 2, reference: '2:2', arabicSnippet: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ', englishText: 'That is the Book about which there is no doubt.' }
    ]
  },
  'وقي': {
    arabicLetters: 'و - ق - ي',
    transliteration: 'W-Q-Y',
    laneDefinition: 'To shield, preserve, guard, erect a defensive barrier between oneself and peril.',
    lanePage: 'Book 1, p. 3059',
    relatedWords: [
      { arabic: 'تَقْوَى', transliteration: 'Taqwā', meaning: 'God-consciousness, pious shield' },
      { arabic: 'مُتَّقِينَ', transliteration: 'Muttaqīn', meaning: 'Those who shield themselves with piety' }
    ],
    otherQuranVerses: [
      { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 2, reference: '2:2', arabicSnippet: 'هُدًى لِّلْمُتَّقِينَ', englishText: 'Guidance for those conscious of Allah.' }
    ]
  },
  'هدي': {
    arabicLetters: 'ه - د - ي',
    transliteration: 'H-D-Y',
    laneDefinition: 'To guide gently, illuminate the path, show the way of safety, lead step by step to salvation.',
    lanePage: 'Book 1, p. 2904',
    relatedWords: [
      { arabic: 'هُدًى', transliteration: 'Hudan', meaning: 'Guidance, illumination' },
      { arabic: 'اهْدِنَا', transliteration: 'Ihdinā', meaning: 'Guide us' }
    ],
    otherQuranVerses: [
      { surahNumber: 1, surahName: 'Al-Fatihah', verseNumber: 6, reference: '1:6', arabicSnippet: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', englishText: 'Guide us to the straight path.' }
    ]
  }
};

/**
 * Retrieves classical Lane's Lexicon information for any root.
 * Normalizes input and searches by clean Arabic root.
 */
export function getLanesRootInfo(rootStr?: string): LanesRootEntry | null {
  if (!rootStr) return null;
  const clean = getCleanArabicRoot(rootStr);
  if (!clean || PSEUDO_PARTICLE_ROOTS.has(clean)) return null;

  if (LANES_ROOT_KNOWLEDGE[clean]) {
    return LANES_ROOT_KNOWLEDGE[clean];
  }

  // Fallback entry with clean letters and direct Lane's Lexicon ejtaal.net reference
  const spaced = formatArabicRootSpaced(clean);
  return {
    arabicLetters: spaced,
    transliteration: clean,
    laneDefinition: `Classical Arabic triliteral root investigated in Edward William Lane's Lexicon (Madd al-Qāmūs).`,
    lanePage: 'Arabic Almanac Lexicon',
    relatedWords: [],
    otherQuranVerses: []
  };
}

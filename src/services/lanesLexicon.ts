/**
 * Classical Arabic Root & Lexicography Service
 * Powered by Edward William Lane's Arabic-English Lexicon (مدّ القاموس - Madd al-Qamus)
 * and ejtaal.net (Arabic Almanac / Mawrid Reader)
 */

export interface LanesRootEntry {
  arabicLetters: string; // e.g. "ق - و - ل"
  transliteration: string; // e.g. "Q-W-L"
  laneDefinition: string;
  classicalNuances?: string[];
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
  // Surah An-Nas & Al-Falaq roots
  'قول': {
    arabicLetters: 'ق - و - ل',
    transliteration: 'Q-W-L',
    laneDefinition: 'To say, utter, articulate, pronounce; foundational classical root for speech, dictation, and divine proclamation (Lane p. 2995).',
    classicalNuances: ['He uttered an articulate phrase', 'He commanded with authority', 'Contextual proclamation']
  },
  'عوذ': {
    arabicLetters: 'ع - و - ذ',
    transliteration: 'ʿ-W-Dh',
    laneDefinition: 'To take refuge, betake oneself for shelter, seek haven against peril, cleave to a protective sanctuary (Lane p. 2192).',
    classicalNuances: ['Seeking shelter against an adversary', 'Placing oneself under divine asylum', 'Invoking sanctuary']
  },
  'ربب': {
    arabicLetters: 'ر - ب - ب',
    transliteration: 'R-B-B',
    laneDefinition: 'To foster, nourish, rear, bring up gradually toward perfection; to possess supreme dominion, sustain, and govern (Lane p. 1004).',
    classicalNuances: ['The Evolver and Sustainer', 'Nurturing from stage to stage', 'Sovereign caregiver']
  },
  'نوس': {
    arabicLetters: 'ن - و - س',
    transliteration: 'N-W-S',
    laneDefinition: 'To swing, sway, move to and fro; mankind (Al-Nas) as dynamic beings possessing social affinity and movement (Lane p. 2867).',
    classicalNuances: ['Humanity in its mortal agitation', 'Companionable social beings', 'The general human species']
  },
  'ملك': {
    arabicLetters: 'م - ل - ك',
    transliteration: 'M-L-K',
    laneDefinition: 'To possess, hold dominion, command authority, have sovereign rule, reign over subjects without restriction (Lane p. 3020).',
    classicalNuances: ['Supreme kingly dominion', 'Absolute ownership', 'Effective governing control']
  },
  'اله': {
    arabicLetters: 'إ - ل - ه',
    transliteration: 'ʾ-L-H',
    laneDefinition: 'To worship, adore with supreme love and reverential awe; to take refuge in when bewildered or desperate (Lane p. 82).',
    classicalNuances: ['The sole Object of Adoration', 'The Sanctuary in perplexity', 'Exclusive right of servitude']
  },
  'شرر': {
    arabicLetters: 'ش - ر - ر',
    transliteration: 'Sh-R-R',
    laneDefinition: 'Evil, injury, malice, active corruption, that which produces disadvantage and peril (Lane p. 1526).',
    classicalNuances: ['Active malice', 'Malignant harm', 'Spiritual detriment']
  },
  'وسوس': {
    arabicLetters: 'و - س - و - س',
    transliteration: 'W-S-W-S',
    laneDefinition: 'To whisper insidiously, make a faint rustling or covert murmur; insidious suggestions repeated to stir hidden desires (Lane p. 3054).',
    classicalNuances: ['Covert whisperings in the chest', 'Faint rustling sound of movement', 'Repeated insidious instigation']
  },
  'خنس': {
    arabicLetters: 'خ - ن - س',
    transliteration: 'Kh-N-S',
    laneDefinition: 'To withdraw, shrink back, recede, slink away stealthily upon encountering light or the remembrance of God (Lane p. 811).',
    classicalNuances: ['Retreating upon being countered', 'Slinking into concealment', 'Lurking in secret to strike again']
  },
  'فلق': {
    arabicLetters: 'ف - ل - ق',
    transliteration: 'F-L-Q',
    laneDefinition: 'To split, cleave asunder, burst forth into light; daybreak cleaving the gloom of night (Lane p. 2441).',
    classicalNuances: ['The dawn splitting the horizon', 'Cleaving seeds and date-stones to bring forth life', 'Divine emergence of morning']
  },
  'غسق': {
    arabicLetters: 'غ - س - ق',
    transliteration: 'Gh-S-Q',
    laneDefinition: 'Darkness deepening intensely; the setting of the red dusk and full immersion into night (Lane p. 2253).',
    classicalNuances: ['Deepening nightfall', 'Intense midnight gloom', 'Concealment of predators']
  },
  'وقب': {
    arabicLetters: 'و - ق - ب',
    transliteration: 'W-Q-B',
    laneDefinition: 'To enter into, penetrate a cavity or hollow, overspread completely (Lane p. 2958).',
    classicalNuances: ['Penetrating deep obscurity', 'Entering into an aperture', 'Overspreading darkness']
  },
  'نفث': {
    arabicLetters: 'ن - ف - ث',
    transliteration: 'N-F-Th',
    laneDefinition: 'To blow with a slight moisture or spitting sound; uttering incantations over knots (Lane p. 2824).',
    classicalNuances: ['Blowing over cord knots', 'Occult incantation', 'Subtle breath with slight moisture']
  },
  'عقد': {
    arabicLetters: 'ع - ق - د',
    transliteration: 'ʿ-Q-D',
    laneDefinition: 'To tie a knot, bind fast, compact, consolidate an agreement or contract (Lane p. 2102).',
    classicalNuances: ['Firm knots in cords', 'Inviolable covenants', 'Resolution of intention']
  },
  'حسد': {
    arabicLetters: 'ح - س - د',
    transliteration: 'Ḥ-S-D',
    laneDefinition: 'To envy, begrudge another person their blessing and desire that they be deprived of it (Lane p. 570).',
    classicalNuances: ['Coveting cessation of another\'s grace', 'Malignant resentment', 'Internal spiritual poison']
  },

  // Al-Ikhlas & Al-Kawthar roots
  'احد': {
    arabicLetters: 'أ - ح - د',
    transliteration: 'ʾ-Ḥ-D',
    laneDefinition: 'Sole, indivisible, unique, having no component parts, partner, or peer in essence or attributes (Lane p. 26).',
    classicalNuances: ['Absolute indivisibility', 'Uniqueness transcending multiplicity', 'Singular in eternity']
  },
  'صمد': {
    arabicLetters: 'ص - م - د',
    transliteration: 'Ṣ-M-D',
    laneDefinition: 'The Eternal Refuge, the Lord to whom recourse is had in all affairs, solid without void, self-sufficient (Lane p. 1726).',
    classicalNuances: ['Depended upon by all creation', 'Free from need of sustenance', 'Immense and imperishable']
  },
  'ولد': {
    arabicLetters: 'و - ل - د',
    transliteration: 'W-L-D',
    laneDefinition: 'To beget, bring forth offspring, produce progeny (Lane p. 3058).',
    classicalNuances: ['Biological descent', 'Originating offspring', 'Transcended by the Divine']
  },
  'كفا': {
    arabicLetters: 'ك - ف - أ',
    transliteration: 'K-F-ʾ',
    laneDefinition: 'To be equal, like, matching in station, an equal peer or counterpart (Lane p. 2616).',
    classicalNuances: ['An equivalent counterpart', 'A matching comparable entity', 'Co-equal status']
  },
  'تبب': {
    arabicLetters: 'ت - ب - ب',
    transliteration: 'T-B-B',
    laneDefinition: 'To suffer ruin, loss, perdition, cut off from success, continual destruction (Lane p. 297).',
    classicalNuances: ['Complete destruction of enterprise', 'Total loss in this life and Hereafter', 'Severed from good']
  },
  'كسب': {
    arabicLetters: 'ك - س - ب',
    transliteration: 'K-S-B',
    laneDefinition: 'To earn, gain, acquire through physical exertion, conduct, or moral deeds (Lane p. 2611).',
    classicalNuances: ['Material acquisition', 'Accumulation of deeds', 'Personal accountability']
  },
  'كوثر': {
    arabicLetters: 'ك - و - ث - ر',
    transliteration: 'K-W-Th-R',
    laneDefinition: 'Abundant, overflowing, perpetual good; the superabundant river and basin granted to the Prophet ﷺ (Lane p. 2596).',
    classicalNuances: ['Superabundant grace', 'Celestial river in Paradise', 'Unending legacy']
  },
  'نحر': {
    arabicLetters: 'ن - ح - ر',
    transliteration: 'N-Ḥ-R',
    laneDefinition: 'To sacrifice, slaughter an animal by piercing the upper chest / jugular; devotion of sacrificial rites (Lane p. 2774).',
    classicalNuances: ['Sacrificial offering for Allah alone', 'Devotional slaughter', 'Consecration of life']
  },
  'شنا': {
    arabicLetters: 'ش - ن - أ',
    transliteration: 'Sh-N-ʾ',
    laneDefinition: 'To hate, detest with deep malice, bear bitter animosity (Lane p. 1601).',
    classicalNuances: ['Spiteful hatred', 'Detraction and enmity', 'Grudge of adversaries']
  },
  'بتر': {
    arabicLetters: 'ب - ت - ر',
    transliteration: 'B-T-R',
    laneDefinition: 'To cut off, sever before maturity, deprive of offspring and lasting memory (Lane p. 150).',
    classicalNuances: ['Cut off from all goodness', 'Deprived of lineage and legacy', 'Extinguished posterity']
  },

  // Al-Fatihah & Al-Baqarah foundational roots
  'سمو': {
    arabicLetters: 'س - م - و',
    transliteration: 'S-M-W',
    laneDefinition: 'To be high, lofty, elevated; a distinguishing sign, mark, or name designating reality (Lane p. 1429).',
    classicalNuances: ['Elevation above the earth', 'Designation of identity', 'Transcendence']
  },
  'حمد': {
    arabicLetters: 'ح - م - د',
    transliteration: 'Ḥ-M-D',
    laneDefinition: 'To praise, laud, commend with feelings of supreme love, gratitude, and reverence for intrinsic perfection (Lane p. 627).',
    classicalNuances: ['Voluntary praise for excellence', 'Heartfelt gratitude', 'Universal laudation']
  },
  'رحم': {
    arabicLetters: 'ر - ح - م',
    transliteration: 'R-Ḥ-M',
    laneDefinition: 'Tenderness, mercy, compassion, maternal womb bond; benevolence toward the vulnerable (Lane p. 1055).',
    classicalNuances: ['All-encompassing universal mercy (Rahman)', 'Specialized abiding grace (Rahim)', 'Bond of kinship']
  },
  'دين': {
    arabicLetters: 'د - ي - ن',
    transliteration: 'D-Y-N',
    laneDefinition: 'Obedience, subjection, reckoning, moral law, religion, recompense of actions (Lane p. 917).',
    classicalNuances: ['The Day of Divine Reckoning', 'The primordial religion', 'Complete submission']
  },
  'عبد': {
    arabicLetters: 'ع - ب - د',
    transliteration: 'ʿ-B-D',
    laneDefinition: 'To serve with utmost humility and lowliness combined with supreme love and veneration (Lane p. 1935).',
    classicalNuances: ['Total human servitude', 'Adoration without reservation', 'Submission to divine law']
  },
  'هدي': {
    arabicLetters: 'ه - د - ي',
    transliteration: 'H-D-Y',
    laneDefinition: 'To guide gently, illuminate the path, show the way of safety, lead step by step to salvation (Lane p. 2904).',
    classicalNuances: ['Inward spiritual illumination', 'Clear outward instruction', 'Bestowal of success']
  },
  'صرط': {
    arabicLetters: 'ص - ر - ط',
    transliteration: 'Ṣ-R-Ṭ',
    laneDefinition: 'A level, wide, evident highway that swallows travelers smoothly without divergent bends (Lane p. 1678).',
    classicalNuances: ['The upright level highway', 'Direct path without deviation', 'The authentic prophetic tradition']
  },
  'كتب': {
    arabicLetters: 'ك - ت - ب',
    transliteration: 'K-T-B',
    laneDefinition: 'To draw together, join parts, stitch, inscribe, decree firmly with permanent obligation (Lane p. 2589).',
    classicalNuances: ['Gathering wisdom into unified scripture', 'Firm decree in the Preserved Tablet', 'Binding divine obligation']
  },
  'ريب': {
    arabicLetters: 'ر - ي - ب',
    transliteration: 'R-Y-B',
    laneDefinition: 'Disquieting agitation of mind, suspicion, suspicion causing restless disturbance (Lane p. 1205).',
    classicalNuances: ['Absence of tormenting doubt', 'Unwavering inner certainty', 'Pure serenity of truth']
  },
  'وقي': {
    arabicLetters: 'و - ق - ي',
    transliteration: 'W-Q-Y',
    laneDefinition: 'To shield, preserve, guard, erect a defensive barrier between oneself and peril (Lane p. 3059).',
    classicalNuances: ['Taking protection against divine wrath', 'Moral vigilance (Taqwa)', 'Shielding conscience']
  },
  'كفر': {
    arabicLetters: 'ك - ف - ر',
    transliteration: 'K-F-R',
    laneDefinition: 'To cover, conceal, bury; linguistically a tiller burying seed in earth, theologically burying innate truth (Lane p. 2621).',
    classicalNuances: ['Active suppression of conscience', 'Ingratitude toward divine favors', 'Concealing monotheistic reality']
  },
  'غيب': {
    arabicLetters: 'غ - ي - ب',
    transliteration: 'Gh-Y-B',
    laneDefinition: 'That which is concealed from physical sensory perception, absent from sight but confirmed by revelation (Lane p. 2311).',
    classicalNuances: ['Metaphysical celestial realities', 'Unseen divine realm', 'Transcendence beyond empirical senses']
  },
  'صلو': {
    arabicLetters: 'ص - ل - و',
    transliteration: 'Ṣ-L-W',
    laneDefinition: 'Supplication, bending to connect, bowing the back, worship; the sacred bond between Creator and creation (Lane p. 1720).',
    classicalNuances: ['Prescribed five daily prayers', 'Direct communion with Allah', 'Divine blessings upon creation']
  },
  'نزل': {
    arabicLetters: 'ن - ز - ل',
    transliteration: 'N-Z-L',
    laneDefinition: 'To descend from an elevation, alight, lodge, settle; revelation sent down from on high (Lane p. 2788).',
    classicalNuances: ['Descent of celestial scripture', 'Hospitality toward guests', 'Spiritual arrival']
  },
  'فلح': {
    arabicLetters: 'ف - ل - ح',
    transliteration: 'F-L-Ḥ',
    laneDefinition: 'To split, cleave the earth by plowing, harvest prosperity, attain eternal salvation and flourishing in Paradise (Lane p. 2443).',
    classicalNuances: ['Harvesting the fruits of righteousness', 'Everlasting triumph in the Hereafter', 'Attaining moral fulfillment']
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
    laneDefinition: `Classical Arabic triliteral root investigated in Edward William Lane's Lexicon (Madd al-Qamus), referencing classical authorities Taj al-ʿArus and Lisan al-ʿArab.`,
  };
}

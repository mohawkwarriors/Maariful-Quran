import { CuratedTerm } from '../types/quran';

export const VOCABULARY_KNOWLEDGE: Record<string, Partial<CuratedTerm>> = {
  salah: {
    term: 'Salah (الصلاة)',
    arabicRoot: 'ص-ل-و (Ṣ-L-W)',
    literalMeaning: 'Supplication, devotion, and sacred connection.',
    relatedWords: ['Musalli (prayer performer)', 'Salawat (prayers / blessings)', 'Silah (link / connection)'],
    theologicalContext:
      'The designated ritual worship prescribed five times daily, embodying the highest physical and spiritual expression of human servitude connecting the servant directly to Allah.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 116",
  },
  muttaqin: {
    term: 'Al-Muttaqin (المتقين)',
    arabicRoot: 'و-ق-ي (W-Q-Y)',
    literalMeaning: 'Those who take a defensive shield against harm.',
    relatedWords: ['Taqwa (God-consciousness / piety)', 'Wiqayah (shield / protection)', 'Ittaqa (guarded against evil)'],
    theologicalContext:
      "Those who erect a protective shield against divine displeasure by obeying Allah's commandments and restraining their souls from prohibited desires.",
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 104",
  },
  taqwa: {
    term: 'Taqwa (التقوى)',
    arabicRoot: 'و-ق-ي (W-Q-Y)',
    literalMeaning: 'Vigilant forbearance, self-restraint, and shielding.',
    relatedWords: ['Muttaqi (God-fearing person)', 'Tuqat (precaution)', 'Awqa (most protective)'],
    theologicalContext:
      'The inner spiritual moral conscience that keeps a believer perpetually mindful of Allah, acting as an inward barrier against sins in public and seclusion alike.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 106",
  },
  ghayb: {
    term: 'Al-Ghayb (الغيب)',
    arabicRoot: 'غ-ي-ب (Gh-Y-B)',
    literalMeaning: 'That which is hidden, unseen, and beyond physical senses.',
    relatedWords: ['Gha\'ib (absent)', 'Ghaybah (occultation / absence)', 'Ightiyab (speaking of the absent)'],
    theologicalContext:
      'The celestial and metaphysical realities verified solely by infallible prophetic revelation, including the Divine Essence and Attributes, angels, the grave, and the Day of Judgment.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 110",
  },
  riba: {
    term: 'Riba (الربا)',
    arabicRoot: 'ر-ب-و (R-B-W)',
    literalMeaning: 'Unearned surplus, unjustified excess, or swelling.',
    relatedWords: ['Rabwah (elevated hill)', 'Yurbi (causes to increase)', 'Tarbiyah (growth / nurturing)'],
    theologicalContext:
      'Any stipulated excess charged on a debt without an equivalent countervalue (Iwad) in exchange. Categorically prohibited in Islam because it institutionalizes wealth exploitation.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 642",
  },
  zakah: {
    term: 'Zakah (الزكاة)',
    arabicRoot: 'ز-ك-و (Z-K-W)',
    literalMeaning: 'Purification, spiritual growth, and blessing.',
    relatedWords: ['Tazkiyah (spiritual purification)', 'Zaki (pure / righteous)', 'Yazakka (purifies himself)'],
    theologicalContext:
      "The obligatory annual fiscal duty levied on qualifying surplus wealth to purify one's assets and support the underprivileged.",
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 122",
  },
  ibadah: {
    term: 'Ibadah (العبادة)',
    arabicRoot: 'ع-ب-د (ʿ-B-D)',
    literalMeaning: 'Utmost humility coupled with supreme love and reverence.',
    relatedWords: ['Abd (servant / slave of God)', 'Ubudiyyah (servitude)', 'Ma\'bud (object of worship)'],
    theologicalContext:
      'The totality of inward convictions and outward actions rendered sincerely and exclusively for the pleasure of Allah, in accordance with prophetic guidance.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 68",
  },
  rahman: {
    term: 'Ar-Rahman (الرحمن)',
    arabicRoot: 'ر-ح-م (R-Ḥ-M)',
    literalMeaning: 'Vast, overwhelming, all-encompassing mercy.',
    relatedWords: ['Rahim (perpetually merciful)', 'Rahmah (mercy / compassion)', 'Rahim (womb / kinship bond)'],
    theologicalContext:
      'The active, cosmic benevolence of Allah that encompasses all created beings—believer and disbeliever alike—in this worldly existence through sustenance and life.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 43",
  },
  rahim: {
    term: 'Ar-Rahim (الرحيم)',
    arabicRoot: 'ر-ح-م (R-Ḥ-M)',
    literalMeaning: 'Continuous, perpetual, and specialized grace.',
    relatedWords: ['Ar-Rahman (All-Beneficent)', 'Marhamah (mutual compassion)', 'Tarham (seeking mercy)'],
    theologicalContext:
      'The abiding, eternal attribute of divine grace reserved specifically for righteous believers in the Hereafter.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 46",
  },
  rabb: {
    term: 'Ar-Rabb (الرب)',
    arabicRoot: 'ر-ب-ب (R-B-B)',
    literalMeaning: 'The Evolver, Sustainer, and Caregiver who nurtures to perfection.',
    relatedWords: ['Rabib (foster ward)', 'Rububiyyah (divine lordship)', 'Ribbiyyun (godly devotees)'],
    theologicalContext:
      'The divine name indicating providential care, continuous creation, and progressive nourishment of every atom across all domains of existence.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 55",
  },
  kufr: {
    term: 'Kufr (الكفر)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'To cover, conceal, or bury (linguistically: a farmer burying seed in earth; theologically: burying the light of truth).',
    relatedWords: ['Kafir (one who conceals truth / disbeliever)', 'Kaffarah (prescribed expiation that conceals / wipes out sins)', 'Kuffar (disbelievers / farmers who bury seed)'],
    theologicalContext:
      'In Ma\'ariful Qur\'an, Mufti Muhammad Shafi explains that Kufr denotes deliberate, stubborn persistence in burying the truth after divine guidance and moral conscience have been made abundantly clear. The root conveys concealing something evident, showing that rejection of truth is an active suppression of one\'s innate God-consciousness (فطرة / Fitrah).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128",
  },
  kaffar: {
    term: 'Kaffar (كَفَّار / كفر)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'To cover, conceal, or bury (linguistically: a farmer who buries seed in dark soil; theologically: obstinately concealing the truth).',
    relatedWords: ['Kafir (disbeliever / one who conceals truth)', 'Kufr (active rejection of truth)', 'Kaffarah (prescribed expiation that wipes out sins)', 'Kuffar (farmers who bury seed / deniers)'],
    theologicalContext:
      'In Ma\'ariful Qur\'an, Mufti Muhammad Shafi explains that Kufr here refers to deliberate, stubborn persistence in burying the truth after divine guidance and moral conscience have been made abundantly clear. The linguistic root conveys concealing something evident, showing that rejection of truth is an active suppression of one\'s innate God-consciousness (فطرة / Fitrah).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128-132",
  },
  kafaru: {
    term: 'Kafaru (كَفَرُوا)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'They willfully covered, concealed, and denied the truth.',
    relatedWords: ['Kufr (denial / covering)', 'Kafir (one who denies)', 'Kaffarah (expiation)'],
    theologicalContext:
      'Referring specifically to obstinate ringleaders of disbelief whose inner defiance reached a point of no return. Mufti Shafi notes that their disbelief was not due to lack of evidence, but deliberate malice and pride.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128",
  },
  ghishawah: {
    term: 'Ghishawah (غِشَاوَة)',
    arabicRoot: 'غ-ش-و (Gh-Sh-W)',
    literalMeaning: 'An opaque cataract, dense veil, or membrane covering perception.',
    relatedWords: ['Ghashiya (it engulfed / covered)', 'Yaghsha (he covers)', 'Al-Ghashiyah (The Overwhelming Event)'],
    theologicalContext:
      'Mufti Shafi points out a subtle grammatical nuance: while the seal is placed on hearts and ears, the vision is covered by a "Ghishawah" (veil), indicating that their sensory perception remains physically intact yet spiritually blinded to moral signs through willful obstinacy.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 135",
  },
  khatm: {
    term: 'Khatm (خَتْم)',
    arabicRoot: 'خ-ت-م (Kh-T-M)',
    literalMeaning: 'To imprint a wax seal, stamp firmly closed, or finalize.',
    relatedWords: ['Khatam (seal / signet ring)', 'Khatam an-Nabiyyin (Seal of the Prophets)', 'Khitam (closing seal)'],
    theologicalContext:
      'Mufti Shafi explains that this sealing is the natural divine law of moral consequences: persistent rejection of truth darkens the spiritual receptor until it loses the capacity to receive guidance, like soot encrusting a mirror until it can no longer reflect light.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 133",
  },
  marad: {
    term: 'Marad (مَرَض)',
    arabicRoot: 'م-ر-ض (M-R-D)',
    literalMeaning: 'Chronic sickness, imbalance, corruption, or moral decay.',
    relatedWords: ['Marid (sick person)', 'Mumarrid (healer / caregiver)', 'Tamarrud (disorder)'],
    theologicalContext:
      'Refers to spiritual ailments festering in the psyche of hypocrites—chiefly jealousy, skepticism, and moral cowardice. As they persist in malicious plotting against truth, Allah permits their inner malice to swell as a consequence of their own deceit.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 144",
  },
  andad: {
    term: 'Andad (أَنْدَاد)',
    arabicRoot: 'ن-د-د (N-D-D)',
    literalMeaning: 'Peers, equals, or rival counterparts set up in competition.',
    relatedWords: ['Nidd (rival / peer)', 'Nadid (counterpart)', 'Niddiyyah (rivalry)'],
    theologicalContext:
      'False deities, idols, or worldly objects of supreme devotion elevated alongside Allah. Mufti Shafi notes that anyone who attributes independent causal authority to creation sets up a form of Nidd.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 176",
  },
  fasad: {
    term: 'Fasad (فَسَاد)',
    arabicRoot: 'ف-س-د (F-S-D)',
    literalMeaning: 'Rot, ruin, moral disorder, or disruption of balance.',
    relatedWords: ['Mufsid (corrupter / instigator of discord)', 'Afsada (he caused mischief)', 'Fasid (corrupted / invalid)'],
    theologicalContext:
      'Any action that destabilizes the spiritual, moral, or social order established by divine guidance. Hypocrites label their subversive compromises "peacemaking" (إصلاح / Islah), which the Qur\'an exposes as pure Fasad.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 148",
  },
  islah: {
    term: 'Islah (إِصْلَاح)',
    arabicRoot: 'ص-ل-ح (Ṣ-L-Ḥ)',
    literalMeaning: 'Rectification, peacemaking, restorative healing, and setting right.',
    relatedWords: ['Salih (righteous / virtuous person)', 'Sulh (reconciliation / treaty)', 'Muslih (reformer / peacemaker)'],
    theologicalContext:
      'Restoring balance and righteousness in accordance with divine law. Authentic reform begins with inward self-rectification before extending to societal reform.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 150",
  },
  nifaq: {
    term: 'Nifaq (النفاق)',
    arabicRoot: 'ن-ف-ق (N-F-Q)',
    literalMeaning: 'Duplicity, double-dealing; entering through one opening and exiting another.',
    relatedWords: ['Munafiq (hypocrite)', 'Nafaq (tunnel / subterranean burrow)', 'Infaq (spending wealth)'],
    theologicalContext:
      'Professing belief outwardly while concealing denial or cynicism internally. Condemned as spiritually more insidious and socially destructive than open disbelief.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 142",
  },
  siyam: {
    term: 'As-Siyam (الصيام)',
    arabicRoot: 'ص-و-م (Ṣ-W-M)',
    literalMeaning: 'Total abstention, holding back, and silence.',
    relatedWords: ['Sa\'im (fasting person)', 'Sawm (fast)', 'Mustaswim (one seeking to fast)'],
    theologicalContext:
      'Prescribed ritual abstention from food, drink, and intimate relations from dawn until sunset with explicit intention to cultivate Taqwa.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 448",
  },
  ahad: {
    term: 'Al-Ahad (الأحد)',
    arabicRoot: 'و-ح-د (W-Ḥ-D)',
    literalMeaning: 'The Single, Unique, and Absolutely Indivisible.',
    relatedWords: ['Wahid (One)', 'Tawhid (monotheism)', 'Ihdah (unification)'],
    theologicalContext:
      'Absolute divine unity that transcends any composition, plurality, partition, or peer in essence, attributes, and actions.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 892",
  },
  samad: {
    term: 'As-Samad (الصمد)',
    arabicRoot: 'ص-م-d (Ṣ-M-D)',
    literalMeaning: 'The solid, unshakable refuge upon whom all depend.',
    relatedWords: ['Samada (turned towards for sanctuary)', 'Masmud (sought out)', 'Samad (eternal fortress)'],
    theologicalContext:
      'The Self-Sufficient Sovereign who neither requires nourishment nor has any need of companions, while every created soul is destitute before Him.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 895",
  },
  waswasah: {
    term: 'Al-Waswasah (الوسوسة)',
    arabicRoot: 'و-س-و-س (W-S-W-S)',
    literalMeaning: 'Faint, repetitive, rustling whispers.',
    relatedWords: ['Waswas (the covert whisperer)', 'Muwiswis (one troubled by doubts)', 'Waswas (whisper)'],
    theologicalContext:
      'Insidious suggestions cast into human hearts by demonic agents and toxic companions to sow doubt, vanity, procrastination, and spiritual discouragement.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 918",
  },
  'sirat al-mustaqim': {
    term: 'As-Sirat al-Mustaqim (الصراط المستقيم)',
    arabicRoot: 'ص-ر-ط / ق-و-م',
    literalMeaning: 'The even, level, and unswerving highway.',
    relatedWords: ['Istiqamah (steadfast uprightness)', 'Qayyim (upright)', 'Sarat (straight road)'],
    theologicalContext:
      'The balanced tradition of Islam revealed in the Qur\'an and lived by the Prophet, avoiding theological excess (Ghuluw) and spiritual apathy (Tafrit).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 76",
  },
};
